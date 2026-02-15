const express = require('express');
const router = express.Router();
const { getProducts, getProductById, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: Get All
// Admin: Create (We will add POST later)
router.route('/').get(getProducts);

// Public: Get One
// Admin: Delete
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct); // <--- Protected!

module.exports = router;