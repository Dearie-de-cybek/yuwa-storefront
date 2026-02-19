// ============================================================
// USER ROUTES
// ============================================================

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserActive,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// ── Public: Auth ──
router.post('/', registerUser);
router.post('/login', loginUser);

// ── Protected: Profile ──
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ── Protected: Addresses ──
router.route('/addresses')
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// ── Admin: User management ──
// NOTE: These must come AFTER /profile and /addresses
// so Express doesn't treat "profile" as an :id param
router.route('/admin/all')
  .get(protect, admin, getAllUsers);

router.route('/admin/:id')
  .get(protect, admin, getUserById);

router.route('/admin/:id/role')
  .put(protect, admin, updateUserRole);

router.route('/admin/:id/toggle-active')
  .put(protect, admin, toggleUserActive);

module.exports = router;