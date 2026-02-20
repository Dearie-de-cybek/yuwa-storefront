// ============================================================
// ORDER SERVICE — Checkout, payment sim, status management
// ============================================================

const { PrismaClient } = require('@prisma/client');
const emailService = require('./emailService');

const prisma = new PrismaClient();

// ============================================================
// INTERNAL HELPERS
// ============================================================

/**
 * Generate a human-readable order number.
 * Format: YUWA-YYYYMMDD-XXX
 */
const _generateOrderNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  // Count today's orders to get sequence number
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const count = await prisma.order.count({
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  const seq = String(count + 1).padStart(3, '0');
  return `YUWA-${dateStr}-${seq}`;
};

/**
 * Log inventory movement.
 */
const _logInventory = async (tx, variantId, newStock, delta, reason, note = null) => {
  await tx.inventoryLog.create({
    data: { variantId, quantityDelta: delta, newStock, reason, note },
  });
};

/**
 * Write audit log.
 */
const _logAudit = async (tx, { action, entityType, entityId, userId, changes = null }) => {
  await tx.auditLog.create({
    data: { action, entityType, entityId, userId, changes },
  });
};

/**
 * Full order include for responses.
 */
const ORDER_INCLUDE = {
  items: true,
  notes: { orderBy: { createdAt: 'desc' } },
  user: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
};

/**
 * Format order for API response.
 */
const _formatOrder = (order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  subtotal: parseFloat(order.subtotal),
  shippingCost: parseFloat(order.shippingCost),
  discount: parseFloat(order.discount),
  totalAmount: parseFloat(order.totalAmount),
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  paymentReference: order.paymentReference,
  promotionCode: order.promotionCode,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  shippingAddress: order.shippingAddress,
  shippingMethod: order.shippingMethod,
  trackingNumber: order.trackingNumber,
  currency: order.currency,
  items: order.items.map((item) => ({
    id: item.id,
    productName: item.productName,
    variantColor: item.variantColor,
    variantSize: item.variantSize,
    variantSku: item.variantSku,
    imageUrl: item.imageUrl,
    quantity: item.quantity,
    price: parseFloat(item.price),
  })),
  notes: order.notes || [],
  user: order.user || null,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

// ============================================================
// 1. CHECKOUT — Create order from cart items
// ============================================================
/**
 * Process checkout.
 * @param {string} userId
 * @param {Object} data - { shippingAddress, shippingMethod?, customerPhone?, promotionCode? }
 * @returns {Object} Created order
 *
 * Flow:
 * 1. Validate cart has items
 * 2. Verify stock for every item
 * 3. Create order + order items (snapshot product data)
 * 4. Decrement stock + log inventory
 * 5. Clear the cart
 * 6. Simulate payment
 * 7. Send confirmation email
 */
// ============================================================
// 1. CHECKOUT — Create order from DIRECT PAYLOAD items
// ============================================================
const checkout = async (userId, data) => {
  // 1. Extract items directly from the payload instead of querying the DB cart
  const { items, shippingAddress, shippingMethod, customerPhone, promotionCode } = data;

  if (!shippingAddress) return { error: 'missing_address' };
  if (!items || !Array.isArray(items) || items.length === 0) return { error: 'empty_cart' };

  // 2. Verify stock and build line items securely from DB
  const stockErrors = [];
  const lineItems = [];

  for (const item of items) {
    // SECURITY: Always fetch the actual variant and product from the DB 
    // to prevent users from altering prices in the frontend payload.
    const dbVariant = await prisma.variant.findUnique({
      where: { id: item.variant.id },
      include: {
        product: {
          include: { media: { where: { position: 0 }, take: 1 } },
        },
      },
    });

    if (!dbVariant) continue; // Skip invalid variants
    const product = dbVariant.product;

    if (dbVariant.stock < item.quantity) {
      stockErrors.push({
        product: product.name,
        variant: `${dbVariant.color} / ${dbVariant.size}`,
        requested: item.quantity,
        available: dbVariant.stock,
      });
      continue;
    }

    // Resolve true price from database
    const unitPrice = dbVariant.price ? parseFloat(dbVariant.price) : parseFloat(product.price);

    lineItems.push({
      variantId: dbVariant.id,
      productId: product.id,
      quantity: item.quantity,
      price: unitPrice,
      productName: product.name,
      variantColor: dbVariant.color,
      variantSize: dbVariant.size,
      variantSku: dbVariant.sku,
      imageUrl: product.media[0]?.url || null,
    });
  }

  if (stockErrors.length > 0) return { error: 'insufficient_stock', details: stockErrors };

  // 3. Calculate totals (using the secure DB prices)
  const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = _calculateShipping(shippingMethod, subtotal);
  let discount = 0;

  // Apply promotion if provided
  let appliedPromotion = null;
  if (promotionCode) {
    const promoResult = await _applyPromotion(promotionCode, userId, subtotal);
    if (promoResult.error) return promoResult;
    discount = promoResult.discount;
    appliedPromotion = promoResult.promotion;
  }

  const totalAmount = Math.max(0, subtotal + shippingCost - discount);

  // 4. Create order in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const orderNumber = await _generateOrderNumber();

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // A. Create order
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId,
        customerEmail: user.email,
        customerPhone: customerPhone || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        subtotal,
        shippingCost,
        discount,
        totalAmount,
        shippingAddress,
        shippingMethod: shippingMethod || 'Standard',
        currency: 'NGN',
        promotionId: appliedPromotion?.id || null,
        promotionCode: appliedPromotion?.code || null,
        items: {
          create: lineItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productName: item.productName,
            variantColor: item.variantColor,
            variantSize: item.variantSize,
            variantSku: item.variantSku,
            imageUrl: item.imageUrl,
            productId: item.productId,
            variantId: item.variantId,
          })),
        },
      },
      include: ORDER_INCLUDE,
    });

    // B. Decrement stock + log inventory
    for (const item of lineItems) {
      const variant = await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });

      await _logInventory(
        tx, item.variantId, variant.stock, -item.quantity,
        'SALE', `Order ${orderNumber}`
      );
    }

    // C. Clear the database cart (just to keep things tidy if they had items synced there)
    await tx.cart.deleteMany({ where: { userId } });

    // D. Record promotion usage
    if (appliedPromotion) {
      await tx.promotionUsage.create({
        data: {
          promotionId: appliedPromotion.id,
          userId,
          orderId: created.id,
        },
      });
      await tx.promotion.update({
        where: { id: appliedPromotion.id },
        data: { currentUses: { increment: 1 } },
      });
    }

    // E. Audit
    await _logAudit(tx, {
      action: 'CREATE',
      entityType: 'Order',
      entityId: created.id,
      userId,
    });

    return created;
  });

  // 5. Simulate payment
  _simulatePayment(order.id);

  return { order: _formatOrder(order) };
};

// ============================================================
// 2. FAKE PAYMENT SIMULATION
// ============================================================

const _simulatePayment = async (orderId) => {
  // Simulate a 2-second payment processing delay
  setTimeout(async () => {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'Test Card',
          paymentReference: `PAY-${Date.now().toString(36).toUpperCase()}`,
          status: 'CONFIRMED',
        },
        include: ORDER_INCLUDE,
      });

      console.log(`💳 Payment simulated for order ${order.orderNumber}`);

      // Send confirmation email
      await emailService.sendOrderConfirmation(order);
    } catch (error) {
      console.error('❌ Payment simulation failed:', error.message);

      // Mark as failed
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' },
      }).catch(() => {});
    }
  }, 2000);
};

// ============================================================
// 3. SHIPPING COST CALCULATION
// ============================================================

const _calculateShipping = (method, subtotal) => {
  // Free shipping over ₦50,000
  if (subtotal >= 50000) return 0;

  const rates = {
    Standard: 3000,
    Express: 5500,
    'Same Day': 8000,
  };

  return rates[method] || rates.Standard;
};

// ============================================================
// 4. PROMOTION VALIDATION
// ============================================================

const _applyPromotion = async (code, userId, subtotal) => {
  const promo = await prisma.promotion.findUnique({ where: { code } });
  if (!promo) return { error: 'invalid_promo', message: 'Promotion code not found' };

  const now = new Date();
  if (!promo.isActive)               return { error: 'invalid_promo', message: 'Promotion is not active' };
  if (now < promo.startDate)         return { error: 'invalid_promo', message: 'Promotion has not started yet' };
  if (now > promo.endDate)           return { error: 'invalid_promo', message: 'Promotion has expired' };
  if (promo.maxUses && promo.currentUses >= promo.maxUses) return { error: 'invalid_promo', message: 'Promotion usage limit reached' };

  if (promo.minOrderAmount && subtotal < parseFloat(promo.minOrderAmount)) {
    return { error: 'invalid_promo', message: `Minimum order amount is ₦${parseFloat(promo.minOrderAmount).toLocaleString()}` };
  }

  // Per-user limit check
  if (promo.maxUsesPerUser) {
    const userUses = await prisma.promotionUsage.count({
      where: { promotionId: promo.id, userId },
    });
    if (userUses >= promo.maxUsesPerUser) {
      return { error: 'invalid_promo', message: 'You have already used this promotion' };
    }
  }

  // Calculate discount
  let discount = 0;
  if (promo.discountType === 'PERCENTAGE') {
    discount = subtotal * (parseFloat(promo.discountValue) / 100);
  } else {
    discount = parseFloat(promo.discountValue);
  }

  return { discount: Math.min(discount, subtotal), promotion: promo };
};

// ============================================================
// 5. CUSTOMER: My Orders
// ============================================================

/**
 * Get all orders for a customer (paginated).
 */
const findByUser = async (userId, { page = 1, limit = 10 }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    orders: orders.map(_formatOrder),
    pagination: { page: parseInt(page), limit: take, total, pages: Math.ceil(total / take) },
  };
};

/**
 * Get a single order by ID. Verifies ownership for customers.
 */
const findById = async (orderId, userId = null) => {
  const where = { id: orderId };
  // If userId provided, enforce ownership (customer view)
  if (userId) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: ORDER_INCLUDE,
  });

  if (!order) return null;
  return _formatOrder(order);
};

// ============================================================
// 6. ADMIN: Order Management
// ============================================================

/**
 * Get all orders (paginated, filterable). Admin only.
 */
const findAll = async ({ page = 1, limit = 20, status, paymentStatus, search, sort = 'newest' }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};
  if (status)        where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderByMap = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    'total-desc': { totalAmount: 'desc' },
    'total-asc': { totalAmount: 'asc' },
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: ORDER_INCLUDE,
      orderBy: orderByMap[sort] || orderByMap.newest,
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(_formatOrder),
    pagination: { page: parseInt(page), limit: take, total, pages: Math.ceil(total / take) },
  };
};

/**
 * Update order status. Admin only.
 * Triggers email notification to customer.
 */
const updateStatus = async (orderId, newStatus, adminId, extras = {}) => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(newStatus)) {
    return { error: 'invalid_status', validStatuses };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: ORDER_INCLUDE,
  });
  if (!order) return { error: 'not_found' };

  // Validate status transitions
  const transitionError = _validateTransition(order.status, newStatus);
  if (transitionError) return { error: 'invalid_transition', message: transitionError };

  const updateData = { status: newStatus };

  // Handle shipping details
  if (newStatus === 'SHIPPED') {
    if (extras.trackingNumber) updateData.trackingNumber = extras.trackingNumber;
    if (extras.shippingMethod) updateData.shippingMethod = extras.shippingMethod;
  }

  // Handle cancellation — restore stock
  if (newStatus === 'CANCELLED' && order.paymentStatus === 'PAID') {
    updateData.paymentStatus = 'REFUNDED';
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({
      where: { id: orderId },
      data: updateData,
      include: ORDER_INCLUDE,
    });

    // Restore stock on cancellation/refund
    if (newStatus === 'CANCELLED' || newStatus === 'REFUNDED') {
      for (const item of order.items) {
        if (item.variantId) {
          const variant = await tx.variant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          await _logInventory(
            tx, item.variantId, variant.stock, item.quantity,
            'RETURN', `Order ${order.orderNumber} ${newStatus.toLowerCase()}`
          );
        }
      }
    }

    // Add admin note
    if (extras.note) {
      await tx.orderNote.create({
        data: {
          orderId,
          content: extras.note,
          isAdmin: true,
        },
      });
    }

    // Audit
    await _logAudit(tx, {
      action: 'UPDATE',
      entityType: 'Order',
      entityId: orderId,
      userId: adminId,
      changes: { before: { status: order.status }, after: { status: newStatus } },
    });

    return result;
  });

  // Send email notification (async, don't block response)
  emailService.sendStatusUpdate(updated, newStatus, extras).catch(() => {});

  return { order: _formatOrder(updated) };
};

/**
 * Add an admin note to an order.
 */
const addNote = async (orderId, content, adminId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { error: 'not_found' };

  const note = await prisma.orderNote.create({
    data: { orderId, content, isAdmin: true },
  });

  return { note };
};

// ============================================================
// INTERNAL: Status transition validation
// ============================================================

const _validateTransition = (current, next) => {
  const allowed = {
    PENDING:    ['CONFIRMED', 'CANCELLED'],
    CONFIRMED:  ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED:    ['DELIVERED'],
    DELIVERED:  ['REFUNDED'],
    CANCELLED:  [],
    REFUNDED:   [],
  };

  if (!allowed[current]?.includes(next)) {
    return `Cannot transition from ${current} to ${next}. Allowed: ${allowed[current]?.join(', ') || 'none'}`;
  }

  return null;
};

module.exports = {
  checkout,
  findByUser,
  findById,
  findAll,
  updateStatus,
  addNote,
};