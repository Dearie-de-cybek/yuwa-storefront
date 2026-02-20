const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const logger = require("./utils/logger"); 

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5001;
    this.prisma = new PrismaClient();
    
    // 1. Initialize System
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // --- THE SECRET SAUCE: MANUAL PREFLIGHT HANDLER ---
  handleCorsPreflightRequests(req, res, next) {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(204).end(); // Respond OK immediately
    }
    next();
  }

 initializeMiddlewares() {
    // 1. Logger
    this.app.use((req, res, next) => {
      logger.http(`${req.method} ${req.url}`);
      next();
    });

    // 2. Manual preflight handler (fixes Express 5 + cors issue)
    this.app.use(this.handleCorsPreflightRequests);

    // 3. Official CORS Package
    this.app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // 4. Body Parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    // Mount your routes here
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/products", productRoutes);
    this.app.use("/api/orders", orderRoutes);
this.app.use("/api/cart", cartRoutes);

    // Default Route
    this.app.get('/', (req, res) => {
      res.send('💎 YUWA Luxury API is Running');
    });
  }

 initializeErrorHandling() {
    // 404 handler
    this.app.all("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Global Crash Handler
    this.app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
      });
    });
  }

  async listen() {
    try {
      // 1. Connect Database
      logger.info("⏳ Connecting to Database...");
      await this.prisma.$connect();
      logger.info("✅ Database Connected.");

      // 2. Start Server
      this.app.listen(this.port, () => {
        logger.info(`💎 YUWA Server started at http://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error("❌ Failed to start server:");
      logger.error(error);
      await this.prisma.$disconnect();
      process.exit(1);
    }
  }
}

// Start the App
const server = new App();
server.listen();