const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Load Config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// });

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---
const userRoutes = require('./routes/userRoutes');

// Mount Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('YUWA Luxury API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n💎 YUWA Server running on http://localhost:${PORT}`);
});