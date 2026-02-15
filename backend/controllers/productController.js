// ============================================================
// PRODUCT CONTROLLER — Skinny: HTTP only, no business logic
// ============================================================
// Responsibilities:
// 1. Extract data from req (params, query, body)
// 2. Call the service
// 3. Send the HTTP response
// ============================================================

const productService = require('../services/productService');

// GET /api/products?page=1&limit=20&status=ACTIVE&category=luxury-bubu&search=silk&sort=newest
const getProducts = async (req, res) => {
  try {
    const result = await productService.findAll(req.query);
    res.json(result);
  } catch (error) {
    console.error('❌ getProducts Error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// GET /api/products/:id  (supports UUID or slug)
const getProductById = async (req, res) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('❌ getProductById Error:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await productService.createDraft(req.user.id);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ createProduct Error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body, req.user.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('❌ updateProduct Error:', error);
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const result = await productService.softDelete(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product moved to trash' });
  } catch (error) {
    console.error('❌ deleteProduct Error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// PATCH /api/products/:id/restore
const restoreProduct = async (req, res) => {
  try {
    const result = await productService.restore(req.params.id, req.user.id);

    if (result.error === 'not_found') return res.status(404).json({ message: 'Product not found' });
    if (result.error === 'not_deleted') return res.status(400).json({ message: 'Product is not deleted' });

    res.json({ message: 'Product restored to drafts' });
  } catch (error) {
    console.error('❌ restoreProduct Error:', error);
    res.status(500).json({ message: 'Restore failed', error: error.message });
  }
};

// PATCH /api/products/:id/status
const updateProductStatus = async (req, res) => {
  try {
    const result = await productService.changeStatus(req.params.id, req.body.status, req.user.id);

    if (result.error === 'not_found')       return res.status(404).json({ message: 'Product not found' });
    if (result.error === 'invalid_status')  return res.status(400).json({ message: `Status must be one of: ${result.validStatuses.join(', ')}` });
    if (result.error === 'no_variants')     return res.status(400).json({ message: 'Cannot publish: product has no active variants' });
    if (result.error === 'no_media')        return res.status(400).json({ message: 'Cannot publish: product has no images' });

    res.json({ message: `Product status updated to ${result.status}` });
  } catch (error) {
    console.error('❌ updateProductStatus Error:', error);
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  updateProductStatus,
};