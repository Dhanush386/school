const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
      department: user.department,
      mustChangePassword: user.mustChangePassword,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── @desc    Login user
// ── @route   POST /api/auth/login
// ── @access  Public
const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Login ID and password are required' });
    }

    // Find user & explicitly select password field (hidden by default)
    const user = await User.findOne({ loginId: loginId.trim().toUpperCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid login ID or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid login ID or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        name: user.name,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture || null,
        mustChangePassword: user.mustChangePassword,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// ── @desc    Change password (authenticated user)
// ── @route   POST /api/auth/change-password
// ── @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old password and new password are required' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password cannot be the same as the old password' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    user.passwordChangedAt = new Date();
    await user.save();

    // Issue new token with updated mustChangePassword
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token,
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get current authenticated user
// ── @route   GET /api/auth/me
// ── @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Forgot password – resets to loginId, forces change on next login
// ── @route   POST /api/auth/forgot-password
// ── @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { loginId } = req.body;

    if (!loginId) {
      return res.status(400).json({ success: false, message: 'Login ID is required' });
    }

    const user = await User.findOne({ loginId: loginId.trim().toUpperCase() }).select('+password');
    if (!user) {
      // Return success regardless to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: 'If the account exists, the password has been reset. Please contact admin for your temporary password.',
      });
    }

    // Reset password to loginId
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.loginId, salt);
    user.mustChangePassword = true;
    user.passwordChangedAt = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset to your Login ID. Please login and change your password immediately.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { login, changePassword, getMe, forgotPassword };

