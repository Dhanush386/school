/**
 * config/db.js
 * Establishes a connection to MongoDB Atlas using Mongoose.
 * Call connectDB() once at server startup before listening on a port.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are the recommended defaults for Mongoose 7+
      // (already set internally, listed here for clarity)
    });

    console.log(
      `✅  MongoDB Connected: ${conn.connection.host} — DB: ${conn.connection.name}`
    );

    // Log when the connection is lost at runtime
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect…');
    });

    // Log successful reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('🔄  MongoDB reconnected successfully.');
    });

    // Surface any post-connect errors without crashing the process immediately
    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB runtime error:', err.message);
    });
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error.message);
    // Exit process so the container/PM2 can restart and retry
    process.exit(1);
  }
};

module.exports = connectDB;
