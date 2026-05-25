const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    loginId: {
      type: String,
      required: [true, 'Login ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'teacher', 'principal', 'admin', 'coordinator', 'hod'],
        message: 'Role must be one of: student, teacher, principal, admin, coordinator, hod',
      },
      required: [true, 'Role is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, 'Please provide a valid phone number'],
      default: null,
    },
    profileImage: {
      type: String,
      default: '',
    },
    mustChangePassword: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save hook: hash password if modified ────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Instance method: compare entered password ────────────────────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Static method: generate login ID ────────────────────────────────────────
/**
 * Generates a login ID like CSE021, TCH003, ADM001.
 * @param {string} department  - Full department name (e.g. "Computer Science Engineering")
 * @param {string} role        - User role (e.g. 'student', 'teacher')
 * @param {number} count       - Sequential count (1-based)
 * @returns {string}           - Generated login ID (e.g. "CSE021")
 */
userSchema.statics.generateLoginId = function (department, role, count) {
  // Build prefix: for non-student roles use role abbreviation, else use dept abbreviation
  const roleAbbreviations = {
    teacher: 'TCH',
    principal: 'PRI',
    admin: 'ADM',
    coordinator: 'CRD',
    hod: 'HOD',
  };

  let prefix;
  if (role === 'student') {
    // Take up to 4 uppercase letters from the department acronym
    const words = department.trim().split(/\s+/);
    if (words.length >= 2) {
      // Multi-word department: take first letter of each word, max 4 chars
      prefix = words
        .map((w) => w[0].toUpperCase())
        .join('')
        .slice(0, 4);
    } else {
      // Single word: take first 3–4 chars
      prefix = department.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    }
  } else {
    prefix = roleAbbreviations[role] || department.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  }

  // Zero-pad count to 3 digits
  const paddedCount = String(count).padStart(3, '0');
  return `${prefix}${paddedCount}`;
};

// ─── Index ────────────────────────────────────────────────────────────────────
userSchema.index({ role: 1, department: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
