const Joi = require('joi');

// ── Login Schema ──────────────────────────────────────────────────────────────
const loginSchema = Joi.object({
  loginId: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'Login ID must be a string',
      'string.empty': 'Login ID is required',
      'string.min': 'Login ID must be at least 3 characters',
      'string.max': 'Login ID must not exceed 20 characters',
      'any.required': 'Login ID is required',
    }),
  password: Joi.string()
    .min(3)
    .max(64)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 3 characters',
      'string.max': 'Password must not exceed 64 characters',
      'any.required': 'Password is required',
    }),
});

// ── Change Password Schema ────────────────────────────────────────────────────
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(3)
    .max(64)
    .required()
    .messages({
      'string.empty': 'Old password is required',
      'any.required': 'Old password is required',
    }),
  newPassword: Joi.string()
    .min(6)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters',
      'string.pattern.base':
        'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
});

// ── Middleware Factory ────────────────────────────────────────────────────────
const createValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  next();
};

// ── Exports ───────────────────────────────────────────────────────────────────
const validateLogin = createValidator(loginSchema);
const validateChangePassword = createValidator(changePasswordSchema);

module.exports = { validateLogin, validateChangePassword };
