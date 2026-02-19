// ============================================================
// ORDER CONTROLLER — Skinny: HTTP only
// ============================================================

const orderService = require('../services/orderService');

// ── CUSTOMER ENDPOINTS ──

// POST /api/orders/checkout
const checkout = async (req, res) => {
  try {
    const result = await orderService.checkout(req.user.id, req.body);

    if (result.error === 'missing_address')     return res.status(400).json({ message: 'Shipping address is required' });
    if (result.error === 'empty_cart')           return res.status(400).json({ message: 'Your cart is empty' });
    if (result.error === 'insufficient_stock')   return res.status(400).json({ message: 'Some items are out of stock', details: result.details });
    if (result.error === 'invalid_promo')        return res.status(400).json({ message: result.message });

    res.status(201).json(result.order);
  } catch (error) {
    console.error('❌ Checkout Error:', error);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
};

// GET /api/orders/my-orders?page=1&limit=10
const getMyOrders = async (req, res) => {
  try {
    const result = await orderService.findByUser(req.user.id, req.query);
    res.json(result);
  } catch (error) {
    console.error('❌ Get My Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// GET /api/orders/my-orders/:id
const getMyOrder = async (req, res) => {
  try {
    const order = await orderService.findById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('❌ Get Order Error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// ── ADMIN ENDPOINTS ──

// GET /api/orders/admin/all?page=1&limit=20&status=SHIPPED&search=YUWA-2026
const getAllOrders = async (req, res) => {
  try {
    const result = await orderService.findAll(req.query);
    res.json(result);
  } catch (error) {
    console.error('❌ Get All Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// GET /api/orders/admin/:id
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('❌ Get Order Error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// PUT /api/orders/admin/:id/status
// Body: { status, trackingNumber?, shippingMethod?, note? }
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, shippingMethod, note } = req.body;
    const result = await orderService.updateStatus(
      req.params.id,
      status,
      req.user.id,
      { trackingNumber, shippingMethod, note }
    );

    if (result.error === 'not_found')          return res.status(404).json({ message: 'Order not found' });
    if (result.error === 'invalid_status')     return res.status(400).json({ message: `Status must be: ${result.validStatuses.join(', ')}` });
    if (result.error === 'invalid_transition') return res.status(400).json({ message: result.message });

    res.json(result.order);
  } catch (error) {
    console.error('❌ Update Status Error:', error);
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
};

// POST /api/orders/admin/:id/notes
// Body: { content }
const addOrderNote = async (req, res) => {
  try {
    const result = await orderService.addNote(req.params.id, req.body.content, req.user.id);

    if (result.error === 'not_found') return res.status(404).json({ message: 'Order not found' });

    res.status(201).json(result.note);
  } catch (error) {
    console.error('❌ Add Note Error:', error);
    res.status(500).json({ message: 'Failed to add note', error: error.message });
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  addOrderNote,
};