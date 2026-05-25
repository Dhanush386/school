const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schema: a bus stop entry
// ─────────────────────────────────────────────────────────────────────────────
const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stop name is required'],
      trim: true,
    },
    time: {
      type: String, // stored as "HH:MM" string e.g. "07:30"
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 1: TransportRoute
// ─────────────────────────────────────────────────────────────────────────────
const transportRouteSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: [true, 'Route number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    stops: {
      type: [stopSchema],
      default: [],
    },
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      trim: true,
      uppercase: true,
    },
    driverName: {
      type: String,
      trim: true,
      default: null,
    },
    driverPhone: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

transportRouteSchema.index({ isActive: 1 });

const TransportRoute = mongoose.model('TransportRoute', transportRouteSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 2: TransportRequest
// ─────────────────────────────────────────────────────────────────────────────
const transportRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportRoute',
      required: [true, 'Route ID is required'],
    },
    pickupStop: {
      type: String,
      required: [true, 'Pickup stop is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be one of: pending, approved, rejected',
      },
      default: 'pending',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    feeStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid'],
        message: 'Fee status must be one of: pending, paid',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

transportRequestSchema.index({ studentId: 1, status: 1 });
transportRequestSchema.index({ routeId: 1, status: 1 });

const TransportRequest = mongoose.model('TransportRequest', transportRequestSchema);

// ─────────────────────────────────────────────────────────────────────────────
module.exports = { TransportRoute, TransportRequest };
