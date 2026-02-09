const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load Config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes (Placeholders for now)
app.get('/', (req, res) => {
  res.send('YUWA Luxury API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n💎 YUWA Server running on http://localhost:${PORT}`);
});