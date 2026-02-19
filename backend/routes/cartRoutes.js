// ============================================================
// CART ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected
router.get('/', protect, getCart);
router.delete('/', protect, clearCart);
router.post('/items', protect, addToCart);
router.put('/items/:id', protect, updateCartItem);
router.delete('/items/:id', protect, removeFromCart);

module.exports = router;