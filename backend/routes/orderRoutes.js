// ============================================================
// ORDER ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const {
  checkout,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  addOrderNote,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// ── Customer routes (protected) ──
router.post('/checkout', protect, checkout);
router.get('/my-orders', protect, getMyOrders);
router.get('/my-orders/:id', protect, getMyOrder);

// ── Admin routes (protected + admin) ──
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/:id', protect, admin, getOrderById);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.post('/admin/:id/notes', protect, admin, addOrderNote);

module.exports = router;