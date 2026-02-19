// ============================================================
// USER SERVICE — All business logic lives here
// ============================================================

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// ============================================================
// INTERNAL HELPERS
// ============================================================

const _generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const _hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const _formatUser = (user, includeToken = false) => {
  const formatted = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || null,
    role: user.role,
  };
  if (includeToken) formatted.token = _generateToken(user.id);
  if (user.addresses) formatted.addresses = user.addresses;
  return formatted;
};

// ============================================================
// AUTH
// ============================================================

/**
 * Register a new user.
 * @returns {{ error?: string, user?: Object }}
 */
const register = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !lastName || !email || !password) {
    return { error: 'missing_fields' };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: 'user_exists' };

  const hashedPassword = await _hashPassword(password);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, password: hashedPassword },
  });

  return { user: _formatUser(user, true) };
};

/**
 * Authenticate user and return token.
 * @returns {{ error?: string, user?: Object }}
 */
const login = async (email, password) => {
  if (!email || !password) return { error: 'missing_fields' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'invalid_credentials' };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { error: 'invalid_credentials' };

  if (!user.isActive) return { error: 'account_disabled' };

  return { user: _formatUser(user, true) };
};

// ============================================================
// PROFILE
// ============================================================

/**
 * Get user profile with addresses.
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  if (!user) return null;
  return _formatUser(user);
};

/**
 * Update user profile fields. Does NOT allow email or role changes.
 * @returns {{ error?: string, user?: Object }}
 */
const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'not_found' };

  const updateData = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined)  updateData.lastName = data.lastName;
  if (data.phone !== undefined)     updateData.phone = data.phone;
  if (data.avatar !== undefined)    updateData.avatar = data.avatar;

  // Password change with current password verification
  if (data.newPassword) {
    if (!data.currentPassword) return { error: 'current_password_required' };
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) return { error: 'current_password_wrong' };
    updateData.password = await _hashPassword(data.newPassword);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return { user: _formatUser(updated, true) };
};

// ============================================================
// ADDRESSES
// ============================================================

/**
 * Add a new address for a user.
 */
const addAddress = async (userId, data) => {
  const { label, firstName, lastName, street, city, state, zip, country, phone, isDefault } = data;

  if (!firstName || !lastName || !street || !city || !state || !zip) {
    return { error: 'missing_fields' };
  }

  // If setting as default, unset all other defaults first
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      label: label || 'Home',
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      country: country || 'NG',
      phone: phone || null,
      isDefault: isDefault || false,
    },
  });

  return { address };
};

/**
 * Update an existing address. Verifies ownership.
 */
const updateAddress = async (userId, addressId, data) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) return { error: 'not_found' };

  const updateData = {};
  if (data.label !== undefined)     updateData.label = data.label;
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined)  updateData.lastName = data.lastName;
  if (data.street !== undefined)    updateData.street = data.street;
  if (data.city !== undefined)      updateData.city = data.city;
  if (data.state !== undefined)     updateData.state = data.state;
  if (data.zip !== undefined)       updateData.zip = data.zip;
  if (data.country !== undefined)   updateData.country = data.country;
  if (data.phone !== undefined)     updateData.phone = data.phone;

  // Handle default toggle
  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    updateData.isDefault = true;
  } else if (data.isDefault === false) {
    updateData.isDefault = false;
  }

  const updated = await prisma.address.update({
    where: { id: addressId },
    data: updateData,
  });

  return { address: updated };
};

/**
 * Delete an address. Verifies ownership.
 */
const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) return { error: 'not_found' };

  await prisma.address.delete({ where: { id: addressId } });
  return { success: true };
};

// ============================================================
// ADMIN: USER MANAGEMENT
// ============================================================

/**
 * Get all users (paginated). Admin only.
 */
const findAll = async ({ page = 1, limit = 20, search, role }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u) => ({
      ...u,
      orderCount: u._count.orders,
      _count: undefined,
    })),
    pagination: { page: parseInt(page), limit: take, total, pages: Math.ceil(total / take) },
  };
};

/**
 * Get single user by ID (admin view with orders).
 */
const findById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
      _count: { select: { orders: true, reviews: true } },
    },
  });

  if (!user) return null;

  return {
    ..._formatUser(user),
    isActive: user.isActive,
    addresses: user.addresses,
    recentOrders: user.orders,
    stats: {
      totalOrders: user._count.orders,
      totalReviews: user._count.reviews,
    },
    createdAt: user.createdAt,
  };
};

/**
 * Update a user's role. Admin only.
 */
const updateRole = async (userId, newRole) => {
  const valid = ['CUSTOMER', 'ADMIN'];
  if (!valid.includes(newRole)) return { error: 'invalid_role', valid };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'not_found' };

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return { success: true, role: newRole };
};

/**
 * Enable or disable a user account. Admin only.
 */
const toggleActive = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'not_found' };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  return { success: true, isActive: updated.isActive };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  findAll,
  findById,
  updateRole,
  toggleActive,
};