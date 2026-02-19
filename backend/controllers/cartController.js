// ============================================================
// CART CONTROLLER — Skinny: HTTP only
// ============================================================

const cartService = require('../services/cartService');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    console.error('❌ Get Cart Error:', error);
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

// POST /api/cart/items
// Body: { variantId, quantity? }
const addToCart = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    if (!variantId) return res.status(400).json({ message: 'Variant ID is required' });

    const result = await cartService.addItem(req.user.id, variantId, quantity || 1);

    if (result.error === 'variant_not_found')  return res.status(404).json({ message: 'Variant not found' });
    if (result.error === 'variant_inactive')   return res.status(400).json({ message: 'This variant is no longer available' });
    if (result.error === 'insufficient_stock') return res.status(400).json({ message: `Only ${result.available} left in stock` });

    res.json(result.cart);
  } catch (error) {
    console.error('❌ Add to Cart Error:', error);
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

// PUT /api/cart/items/:id
// Body: { quantity }
const updateCartItem = async (req, res) => {
  try {
    const result = await cartService.updateItem(req.user.id, req.params.id, req.body.quantity);

    if (result.error === 'not_found')          return res.status(404).json({ message: 'Cart item not found' });
    if (result.error === 'insufficient_stock') return res.status(400).json({ message: `Only ${result.available} left in stock` });

    res.json(result.cart);
  } catch (error) {
    console.error('❌ Update Cart Error:', error);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

// DELETE /api/cart/items/:id
const removeFromCart = async (req, res) => {
  try {
    const result = await cartService.removeItem(req.user.id, req.params.id);

    if (result.error === 'not_found') return res.status(404).json({ message: 'Cart item not found' });

    res.json(result.cart);
  } catch (error) {
    console.error('❌ Remove from Cart Error:', error);
    res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const result = await cartService.clearCart(req.user.id);
    res.json(result.cart);
  } catch (error) {
    console.error('❌ Clear Cart Error:', error);
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};