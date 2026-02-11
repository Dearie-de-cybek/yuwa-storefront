const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// 1. SETUP & LOGGING
console.log('\n🚀 Starting YUWA Backend...');

// Load Environment Variables
const result = dotenv.config();
if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded.');
}

// Debug: Check what actually loaded (Don't log full secrets in production!)
console.log('🔍 Diagnostics:');
console.log(`   - PORT: ${process.env.PORT || 'Not set (Defaulting to 5000)'}`);
console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? 'Loaded (Hidden)' : '❌ MISSING!'}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'Loaded (Hidden)' : '❌ MISSING!'}`);

// Stop immediately if critical vars are missing
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('\n⛔ CRITICAL ERROR: Missing Environment Variables.');
  console.error('   Please check your .env file. Server stopping.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']    
}));
app.use(express.json());

// Request Logger (See every request coming in)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// --- ROUTES ---
const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes'); 

app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('💎 YUWA Luxury API is running...');
});

// Global Error Handler (Catch crashes inside routes)
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// 2. STARTUP SEQUENCE
const startServer = async () => {
  try {
    // Test Database Connection
    console.log('⏳ Connecting to Database...');
    await prisma.$connect();
    console.log('✅ Database Connected Successfully.');

    // Start Listening
    app.listen(PORT, () => {
      console.log(`\n💎 YUWA Server running on http://localhost:${PORT}`);
      console.log('   Ready for requests...\n');
    });

  } catch (error) {
    console.error('\n❌ FAILED TO START SERVER:');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();