/**
 * server.js
 * Entry point for the School ERP Express + Socket.io server.
 *
 * Start in production : node server.js
 * Start in development: nodemon server.js  (or npm run dev)
 */

// ---------------------------------------------------------------------------
// 1. Environment variables – must be loaded before any other import that
//    reads process.env (db.js, middleware, etc.)
// ---------------------------------------------------------------------------
require('dotenv').config();

// Patches async route handlers so unhandled Promise rejections automatically
// flow into the global error handler – no try/catch boilerplate needed.
require('express-async-errors');

// ---------------------------------------------------------------------------
// 2. Core dependencies
// ---------------------------------------------------------------------------
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const morgan     = require('morgan');
const path       = require('path');

// ---------------------------------------------------------------------------
// 3. Internal modules
// ---------------------------------------------------------------------------
const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');
const socketHandler  = require('./socket/socketHandler');

// Route files
const authRoutes       = require('./routes/auth.routes');
const academicRoutes   = require('./routes/academic.routes');
const feesRoutes       = require('./routes/fees.routes');
const hostelRoutes     = require('./routes/hostel.routes');
const libraryRoutes    = require('./routes/library.routes');
const feedbackRoutes   = require('./routes/feedback.routes');
const transportRoutes  = require('./routes/transport.routes');
const complaintsRoutes = require('./routes/complaint.routes');
const paymentRoutes    = require('./routes/paymentRoutes');
const cronRoutes       = require('./routes/cron.routes');
const { initCronJobs } = require('./cron/reminderJobs');

// ---------------------------------------------------------------------------
// 4. App + HTTP server creation
// ---------------------------------------------------------------------------
const app    = express();
const server = http.createServer(app);

// ---------------------------------------------------------------------------
// 5. Socket.io setup
// ---------------------------------------------------------------------------
let io = null;
if (!process.env.VERCEL) {
  io = new Server(server, {
    cors: {
      origin:  process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_ORIGIN
        : '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout:  60000,
    pingInterval: 25000,
  });

  socketHandler(io);
  app.set('io', io);
}

// ---------------------------------------------------------------------------
// 6. Global middleware
// ---------------------------------------------------------------------------

// CORS – allow all in dev, restrict in prod (use CLIENT_ORIGIN env var)
app.use(
  cors({
    origin:      process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_ORIGIN
      : '*',
    credentials: true,
  })
);

// HTTP request logger (concise format in prod, coloured dev format otherwise)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON request bodies (limit raised to handle base64 image previews)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically (e.g. profile pictures, fee receipts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------------------------
// 7. API routes
// ---------------------------------------------------------------------------
// Vercel Serverless: ensure DB is connected before any routes are hit
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });
}

app.use('/api/auth',       authRoutes);
app.use('/api/academic',   academicRoutes);
app.use('/api/fees',       feesRoutes);
app.use('/api/hostel',     hostelRoutes);
app.use('/api/library',    libraryRoutes);
app.use('/api/feedback',   feedbackRoutes);
app.use('/api/transport',  transportRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/payment',    paymentRoutes);
app.use('/api/cron',       cronRoutes);



// ---------------------------------------------------------------------------
// 8. Health-check endpoint (no auth required)
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'School ERP API is running',
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
    onlineUsers: !process.env.VERCEL ? require('./socket/socketHandler').getOnlineUsers().length : 0,
  });
});

// ---------------------------------------------------------------------------
// 9. 404 handler – catches requests that did not match any route
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// ---------------------------------------------------------------------------
// 10. Global error handler – MUST be registered last
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// 11. Connect to DB, then start listening
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  // Export the Express app for Vercel Serverless
  module.exports = app;
} else {
  // Start long-running server
  const startServer = async () => {
    await connectDB();
    initCronJobs();

    server.listen(PORT, () => {
      console.log(
        `🚀 School ERP server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });
  };

  startServer();

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n⚙️  Received ${signal}. Shutting down gracefully…`);

    server.close(async () => {
      console.log('✅  HTTP server closed.');

      try {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
        console.log('✅  MongoDB connection closed.');
      } catch (err) {
        console.error('❌  Error closing MongoDB connection:', err.message);
      }

      process.exit(0);
    });

    setTimeout(() => {
      console.error('❌  Could not close connections in time. Forcing exit.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('❌  Unhandled Promise Rejection:', reason);
  });
  
  module.exports = { app, server, io }; // exported for testing
}
