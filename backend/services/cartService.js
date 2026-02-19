// ============================================================
// CART SERVICE — Server-side persistent cart
// ============================================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Full include for cart responses.
 */
const CART_INCLUDE = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              media: { where: { position: 0 }, take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
};

/**
 * Format cart for API response.
 */
const _formatCart = (cart) => {
  if (!cart) return { items: [], subtotal: 0, itemCount: 0 };

  const items = cart.items.map((ci) => {
    const variant = ci.variant;
    const product = variant.product;
    const unitPrice = variant.price ? parseFloat(variant.price) : parseFloat(product.price);

    return {
      id: ci.id,
      quantity: ci.quantity,
      unitPrice,
      lineTotal: unitPrice * ci.quantity,
      variant: {
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
      },
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: product.media[0]?.url || null,
      },
    };
  });

  return {
    items,
    subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
};

/**
 * Get or create cart for user.
 */
const _getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
};

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Get the user's cart with full product data.
 */
const getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: CART_INCLUDE,
  });
  return _formatCart(cart);
};

/**
 * Add item to cart or increment quantity if already exists.
 * @param {string} userId
 * @param {string} variantId
 * @param {number} quantity
 */
const addItem = async (userId, variantId, quantity = 1) => {
  // Validate variant exists and has stock
  const variant = await prisma.variant.findUnique({ where: { id: variantId } });
  if (!variant) return { error: 'variant_not_found' };
  if (!variant.isActive) return { error: 'variant_inactive' };
  if (variant.stock < quantity) return { error: 'insufficient_stock', available: variant.stock };

  const cart = await _getOrCreateCart(userId);

  // Check if item already in cart
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > variant.stock) {
      return { error: 'insufficient_stock', available: variant.stock };
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, variantId, quantity },
    });
  }

  return { cart: await getCart(userId) };
};

/**
 * Update quantity of a cart item.
 */
const updateItem = async (userId, cartItemId, quantity) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, variant: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) return { error: 'not_found' };

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    if (quantity > cartItem.variant.stock) {
      return { error: 'insufficient_stock', available: cartItem.variant.stock };
    }
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  return { cart: await getCart(userId) };
};

/**
 * Remove an item from the cart.
 */
const removeItem = async (userId, cartItemId) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) return { error: 'not_found' };

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  return { cart: await getCart(userId) };
};

/**
 * Clear entire cart.
 */
const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return { cart: await getCart(userId) };
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};