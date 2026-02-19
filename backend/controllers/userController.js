// ============================================================
// USER CONTROLLER — Skinny: HTTP only, no business logic
// ============================================================

const userService = require('../services/userService');

// ── AUTH ──

// POST /api/users
const registerUser = async (req, res) => {
  try {
    const result = await userService.register(req.body);

    if (result.error === 'missing_fields') return res.status(400).json({ message: 'Please fill in all fields' });
    if (result.error === 'user_exists')    return res.status(400).json({ message: 'User already exists' });

    res.status(201).json(result.user);
  } catch (error) {
    console.error('❌ Register Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    if (result.error === 'missing_fields')      return res.status(400).json({ message: 'Email and password required' });
    if (result.error === 'invalid_credentials')  return res.status(401).json({ message: 'Invalid email or password' });
    if (result.error === 'account_disabled')     return res.status(403).json({ message: 'Account is disabled' });

    res.json(result.user);
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── PROFILE ──

// GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('❌ Get Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);

    if (result.error === 'not_found')                return res.status(404).json({ message: 'User not found' });
    if (result.error === 'current_password_required') return res.status(400).json({ message: 'Current password is required to set a new password' });
    if (result.error === 'current_password_wrong')    return res.status(401).json({ message: 'Current password is incorrect' });

    res.json(result.user);
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── ADDRESSES ──

// POST /api/users/addresses
const addAddress = async (req, res) => {
  try {
    const result = await userService.addAddress(req.user.id, req.body);

    if (result.error === 'missing_fields') return res.status(400).json({ message: 'Please fill in all required address fields' });

    res.status(201).json(result.address);
  } catch (error) {
    console.error('❌ Add Address Error:', error);
    res.status(400).json({ message: 'Invalid address data', error: error.message });
  }
};

// PUT /api/users/addresses/:id
const updateAddress = async (req, res) => {
  try {
    const result = await userService.updateAddress(req.user.id, req.params.id, req.body);

    if (result.error === 'not_found') return res.status(404).json({ message: 'Address not found' });

    res.json(result.address);
  } catch (error) {
    console.error('❌ Update Address Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/users/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const result = await userService.deleteAddress(req.user.id, req.params.id);

    if (result.error === 'not_found') return res.status(404).json({ message: 'Address not found' });

    res.json({ message: 'Address removed' });
  } catch (error) {
    console.error('❌ Delete Address Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── ADMIN: USER MANAGEMENT ──

// GET /api/users  (admin)
const getAllUsers = async (req, res) => {
  try {
    const result = await userService.findAll(req.query);
    res.json(result);
  } catch (error) {
    console.error('❌ Get Users Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/:id  (admin)
const getUserById = async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('❌ Get User Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/:id/role  (admin)
const updateUserRole = async (req, res) => {
  try {
    const result = await userService.updateRole(req.params.id, req.body.role);

    if (result.error === 'not_found')     return res.status(404).json({ message: 'User not found' });
    if (result.error === 'invalid_role')  return res.status(400).json({ message: `Role must be one of: ${result.valid.join(', ')}` });

    res.json({ message: `Role updated to ${result.role}` });
  } catch (error) {
    console.error('❌ Update Role Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/:id/toggle-active  (admin)
const toggleUserActive = async (req, res) => {
  try {
    const result = await userService.toggleActive(req.params.id);

    if (result.error === 'not_found') return res.status(404).json({ message: 'User not found' });

    res.json({
      message: result.isActive ? 'User account enabled' : 'User account disabled',
      isActive: result.isActive,
    });
  } catch (error) {
    console.error('❌ Toggle Active Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};