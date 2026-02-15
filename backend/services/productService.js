// ============================================================
// PRODUCT SERVICE — All business logic lives here
// ============================================================
// The controller calls these methods. This service handles:
// - Database queries & transactions
// - Business rules & validation
// - Inventory logging
// - Audit trails
// - Slug/SKU generation
// ============================================================

const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

// ============================================================
// INTERNAL HELPERS (Private to this service)
// ============================================================

const generateSlug = (name, suffix = '') => {
  const base = slugify(name, { lower: true, strict: true });
  const unique = suffix || Date.now().toString(36);
  return `${base}-${unique}`;
};

const generateSku = (productName, color, size, index = 0) => {
  const namePart = slugify(productName, { lower: false, strict: true }).slice(0, 8).toUpperCase();
  const colorPart = color.replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const sizePart = size.toUpperCase();
  const suffix = index > 0 ? `-${index}` : '';
  return `YUWA-${namePart}-${colorPart}-${sizePart}${suffix}`;
};

/**
 * Standard include for full product responses (PDP).
 */
const FULL_INCLUDE = {
  media: { orderBy: { position: 'asc' } },
  variants: {
    where: { isActive: true },
    include: {
      attributes: true,
      media: { orderBy: { position: 'asc' } },
    },
    orderBy: { createdAt: 'asc' },
  },
  category: { select: { id: true, name: true, slug: true } },
  contentSections: { orderBy: { position: 'asc' } },
  tags: { include: { tag: true } },
  collections: { include: { collection: { select: { id: true, name: true, slug: true } } } },
};

/**
 * Lean include for list views.
 */
const LIST_INCLUDE = {
  media: { where: { position: 0 }, take: 1 },
  variants: {
    where: { isActive: true },
    select: { id: true, color: true, size: true, stock: true, price: true },
  },
  category: { select: { id: true, name: true, slug: true } },
};

const SORT_OPTIONS = {
  newest: { createdAt: 'desc' },
  oldest: { createdAt: 'asc' },
  'price-asc': { price: 'asc' },
  'price-desc': { price: 'desc' },
  name: { name: 'asc' },
};

// ============================================================
// INTERNAL: Category resolution
// ============================================================

const _getOrCreateDefaultCategory = async (tx = prisma) => {
  let category = await tx.category.findFirst({ where: { name: 'Uncategorized' } });
  if (!category) {
    category = await tx.category.create({
      data: {
        name: 'Uncategorized',
        slug: 'uncategorized',
        description: 'Default category for draft products',
      },
    });
  }
  return category.id;
};

const _resolveCategory = async (categoryName, tx = prisma) => {
  if (!categoryName) return null;
  const existing = await tx.category.findFirst({ where: { name: categoryName } });
  if (existing) return existing.id;

  const created = await tx.category.create({
    data: {
      name: categoryName,
      slug: slugify(categoryName, { lower: true, strict: true }),
    },
  });
  return created.id;
};

// ============================================================
// INTERNAL: Inventory & audit logging
// ============================================================

const _logInventory = async (tx, variantId, newStock, delta, reason, note = null) => {
  await tx.inventoryLog.create({
    data: { variantId, quantityDelta: delta, newStock, reason, note },
  });
};

const _logAudit = async (tx, { action, entityType, entityId, userId, changes = null }) => {
  await tx.auditLog.create({
    data: { action, entityType, entityId, userId, changes },
  });
};

// ============================================================
// INTERNAL: Variant sync (smart diff)
// ============================================================

const _syncVariants = async (tx, productId, productName, incomingVariants) => {
  const existing = await tx.variant.findMany({
    where: { productId },
    include: { attributes: true },
  });

  const existingMap = new Map();
  for (const v of existing) {
    existingMap.set(`${v.color}|${v.size}`, v);
  }

  const incomingKeys = new Set();

  for (let i = 0; i < incomingVariants.length; i++) {
    const v = incomingVariants[i];
    const key = `${v.color}|${v.size}`;
    incomingKeys.add(key);

    const found = existingMap.get(key);
    const newStock = parseInt(v.stock) || 0;
    const sku = v.sku || generateSku(productName, v.color, v.size, i);

    if (found) {
      // Update existing variant
      await tx.variant.update({
        where: { id: found.id },
        data: {
          sku,
          price: v.price != null ? parseFloat(v.price) : null,
          stock: newStock,
          weight: v.weight ? parseFloat(v.weight) : null,
          barcode: v.barcode || null,
          isActive: true,
        },
      });

      // Log stock change
      if (newStock !== found.stock) {
        await _logInventory(
          tx, found.id, newStock, newStock - found.stock,
          'ADMIN_EDIT', `Stock updated from ${found.stock} to ${newStock}`
        );
      }

      // Sync attributes
      await _syncAttributes(tx, found.id, v.attributes);

      // Sync variant media
      await _syncVariantMedia(tx, found.id, v.media);

    } else {
      // Create new variant
      const created = await tx.variant.create({
        data: {
          productId,
          sku,
          color: v.color,
          size: v.size,
          price: v.price != null ? parseFloat(v.price) : null,
          stock: newStock,
          weight: v.weight ? parseFloat(v.weight) : null,
          barcode: v.barcode || null,
        },
      });

      if (newStock > 0) {
        await _logInventory(tx, created.id, newStock, newStock, 'RESTOCK', 'Initial stock on variant creation');
      }

      await _syncAttributes(tx, created.id, v.attributes);
      await _syncVariantMedia(tx, created.id, v.media);
    }
  }

  // Soft-deactivate removed variants
  for (const [key, found] of existingMap) {
    if (!incomingKeys.has(key)) {
      await tx.variant.update({
        where: { id: found.id },
        data: { isActive: false },
      });

      if (found.stock > 0) {
        await _logInventory(tx, found.id, 0, -found.stock, 'ADMIN_EDIT', 'Variant deactivated by admin');
      }
    }
  }
};

const _syncAttributes = async (tx, variantId, attributes) => {
  if (!attributes) return;
  await tx.variantAttribute.deleteMany({ where: { variantId } });
  const entries = Object.entries(attributes);
  if (entries.length > 0) {
    await tx.variantAttribute.createMany({
      data: entries.map(([key, value]) => ({ variantId, key, value: String(value) })),
    });
  }
};

const _syncVariantMedia = async (tx, variantId, media) => {
  if (!media) return;
  await tx.media.deleteMany({ where: { variantId } });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((m, idx) => ({
        variantId,
        url: m.url,
        altText: m.altText || null,
        type: m.type || 'IMAGE',
        position: idx,
      })),
    });
  }
};

// ============================================================
// INTERNAL: Media sync
// ============================================================

const _syncProductMedia = async (tx, productId, media) => {
  await tx.media.deleteMany({ where: { productId } });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((m, idx) => ({
        productId,
        url: m.url,
        altText: m.altText || null,
        type: m.type || 'IMAGE',
        position: m.position !== undefined ? m.position : idx,
        width: m.width || null,
        height: m.height || null,
        fileSize: m.fileSize || null,
      })),
    });
  }
};

// ============================================================
// INTERNAL: Content section sync
// ============================================================

const _syncContentSections = async (tx, productId, sections) => {
  for (const section of sections) {
    await tx.productContentSection.upsert({
      where: { productId_type: { productId, type: section.type } },
      update: {
        title: section.title,
        content: section.content,
        position: section.position !== undefined ? section.position : 0,
      },
      create: {
        productId,
        type: section.type,
        title: section.title,
        content: section.content,
        position: section.position !== undefined ? section.position : 0,
      },
    });
  }
};

// ============================================================
// INTERNAL: Tag sync
// ============================================================

const _syncTags = async (tx, productId, tags) => {
  await tx.productTag.deleteMany({ where: { productId } });
  for (const tagName of tags) {
    const tagSlug = slugify(tagName, { lower: true, strict: true });
    const tag = await tx.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { name: tagName, slug: tagSlug },
    });
    await tx.productTag.create({ data: { productId, tagId: tag.id } });
  }
};

// ============================================================
// INTERNAL: Response formatters
// ============================================================

const _formatProductList = (product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  price: parseFloat(product.price),
  compareAt: product.compareAt ? parseFloat(product.compareAt) : null,
  status: product.status,
  featured: product.featured,
  category: product.category,
  image: product.media[0]?.url || null,
  totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
  variantCount: product.variants.length,
  createdAt: product.createdAt,
});

const _formatProductDetail = (product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: parseFloat(product.price),
  compareAt: product.compareAt ? parseFloat(product.compareAt) : null,
  status: product.status,
  featured: product.featured,
  material: product.material,
  metaTitle: product.metaTitle,
  metaDescription: product.metaDescription,
  category: product.category,
  media: product.media.map((m) => ({
    id: m.id, url: m.url, altText: m.altText, type: m.type, position: m.position,
  })),
  variants: product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    color: v.color,
    size: v.size,
    price: v.price ? parseFloat(v.price) : null,
    stock: v.stock,
    weight: v.weight ? parseFloat(v.weight) : null,
    attributes: v.attributes.reduce((acc, a) => { acc[a.key] = a.value; return acc; }, {}),
    media: v.media.map((m) => ({ id: m.id, url: m.url, altText: m.altText, type: m.type })),
  })),
  contentSections: product.contentSections.map((s) => ({
    id: s.id, type: s.type, title: s.title, content: s.content, position: s.position,
  })),
  tags: product.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name, slug: pt.tag.slug })),
  collections: product.collections.map((pc) => pc.collection),
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});


// ============================================================
// PUBLIC API — These are what the controller calls
// ============================================================

/**
 * Fetch paginated, filtered list of products.
 * @returns {{ products: Array, pagination: Object }}
 */
const findAll = async ({ page = 1, limit = 20, status, category, search, featured, sort = 'newest' }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = { isDeleted: false };

  if (status)             where.status = status;
  if (category)           where.category = { slug: category };
  if (featured === 'true') where.featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { material: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, include: LIST_INCLUDE, orderBy, skip, take }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(_formatProductList),
    pagination: { page: parseInt(page), limit: take, total, pages: Math.ceil(total / take) },
  };
};

/**
 * Fetch a single product by UUID or slug.
 * @returns {Object|null} Formatted product or null
 */
const findById = async (idOrSlug) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const product = await prisma.product.findFirst({
    where: {
      ...(isUuid ? { id: idOrSlug } : { slug: idOrSlug }),
      isDeleted: false,
    },
    include: FULL_INCLUDE,
  });

  if (!product) return null;
  return _formatProductDetail(product);
};

/**
 * Create a blank draft product.
 * @returns {Object} Created product
 */
const createDraft = async (adminId) => {
  return prisma.$transaction(async (tx) => {
    const categoryId = await _getOrCreateDefaultCategory(tx);

    const product = await tx.product.create({
      data: {
        name: 'New Draft Product',
        slug: generateSlug('new-draft-product'),
        description: '',
        price: 0.0,
        status: 'DRAFT',
        categoryId,
        createdById: adminId,
        contentSections: {
          create: [
            { type: 'DETAILS', title: 'Product Details', content: '', position: 0 },
            { type: 'SIZE_FIT', title: 'Size & Fit', content: '', position: 1 },
            { type: 'FABRIC_CARE', title: 'Fabric & Care', content: '', position: 2 },
            { type: 'SHIPPING_RETURNS', title: 'Shipping & Returns', content: '', position: 3 },
          ],
        },
      },
      include: FULL_INCLUDE,
    });

    await _logAudit(tx, {
      action: 'CREATE',
      entityType: 'Product',
      entityId: product.id,
      userId: adminId,
    });

    return product;
  });
};

/**
 * Full product update with variant diff, inventory logging, and audit trail.
 * @returns {Object} Updated product
 */
const update = async (productId, data, adminId) => {
  const {
    name, price, compareAt, description, material, category,
    status, featured, metaTitle, metaDescription,
    media, contentSections, variants, tags,
  } = data;

  // Fetch current state for audit diff
  const before = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true, contentSections: true, media: true },
  });

  if (!before || before.isDeleted) {
    return null; // Controller handles 404
  }

  await prisma.$transaction(async (tx) => {
    // Resolve category
    let categoryId = before.categoryId;
    if (category) {
      const resolved = await _resolveCategory(category, tx);
      if (resolved) categoryId = resolved;
    }

    // Build update payload (only include fields that were sent)
    const updateData = { updatedById: adminId };
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = generateSlug(name, productId.slice(0, 8));
    }
    if (price !== undefined)           updateData.price = parseFloat(price);
    if (compareAt !== undefined)       updateData.compareAt = compareAt ? parseFloat(compareAt) : null;
    if (description !== undefined)     updateData.description = description;
    if (material !== undefined)        updateData.material = material;
    if (status !== undefined)          updateData.status = status;
    if (featured !== undefined)        updateData.featured = featured;
    if (metaTitle !== undefined)       updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    updateData.categoryId = categoryId;

    await tx.product.update({ where: { id: productId }, data: updateData });

    // Sync related entities
    if (media !== undefined)           await _syncProductMedia(tx, productId, media);
    if (contentSections !== undefined) await _syncContentSections(tx, productId, contentSections);
    if (tags !== undefined)            await _syncTags(tx, productId, tags);
    if (variants !== undefined)        await _syncVariants(tx, productId, name || before.name, variants);

    // Audit
    await _logAudit(tx, {
      action: 'UPDATE',
      entityType: 'Product',
      entityId: productId,
      userId: adminId,
      changes: {
        before: { name: before.name, price: parseFloat(before.price), status: before.status },
        after: {
          name: name || before.name,
          price: price !== undefined ? parseFloat(price) : parseFloat(before.price),
          status: status || before.status,
        },
      },
    });
  });

  // Return fresh product
  return prisma.product.findUnique({ where: { id: productId }, include: FULL_INCLUDE });
};

/**
 * Soft delete a product and deactivate its variants.
 */
const softDelete = async (productId, adminId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.isDeleted) return null;

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { isDeleted: true, deletedAt: new Date(), status: 'ARCHIVED' },
    });

    await tx.variant.updateMany({
      where: { productId },
      data: { isActive: false },
    });

    await _logAudit(tx, {
      action: 'DELETE',
      entityType: 'Product',
      entityId: productId,
      userId: adminId,
    });
  });

  return true;
};

/**
 * Restore a soft-deleted product back to DRAFT.
 */
const restore = async (productId, adminId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: 'not_found' };
  if (!product.isDeleted) return { error: 'not_deleted' };

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { isDeleted: false, deletedAt: null, status: 'DRAFT' },
    });

    await _logAudit(tx, {
      action: 'RESTORE',
      entityType: 'Product',
      entityId: productId,
      userId: adminId,
    });
  });

  return { success: true };
};

/**
 * Change product status with publish validation.
 */
const changeStatus = async (productId, newStatus, adminId) => {
  const validStatuses = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
  if (!validStatuses.includes(newStatus)) {
    return { error: 'invalid_status', validStatuses };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.isDeleted) return { error: 'not_found' };

  // Publish validation: must have variants and images
  if (newStatus === 'ACTIVE') {
    const [variantCount, mediaCount] = await Promise.all([
      prisma.variant.count({ where: { productId, isActive: true } }),
      prisma.media.count({ where: { productId } }),
    ]);

    if (variantCount === 0) return { error: 'no_variants' };
    if (mediaCount === 0) return { error: 'no_media' };
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: { status: newStatus, updatedById: adminId },
    });

    await _logAudit(tx, {
      action: 'UPDATE',
      entityType: 'Product',
      entityId: productId,
      userId: adminId,
      changes: { before: { status: product.status }, after: { status: newStatus } },
    });
  });

  return { success: true, status: newStatus };
};


module.exports = {
  findAll,
  findById,
  createDraft,
  update,
  softDelete,
  restore,
  changeStatus,
};