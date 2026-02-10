const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. PROTECT: Verifies the user is logged in
const protect = async (req, res, next) => {
  let token;

  // Check for "Bearer <token>" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Decode token to get User ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in DB (exclude password)
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      next(); // Pass to the next function
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. ADMIN: Verifies the user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an Admin' });
  }
};

module.exports = { protect, admin };