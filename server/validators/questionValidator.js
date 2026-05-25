const Joi = require('joi');

// ── Individual question item schema ───────────────────────────────────────────
const questionItemSchema = Joi.object({
  questionText: Joi.string().trim().min(5).max(2000).required().messages({
    'string.empty': 'Question text is required',
    'string.min': 'Question text must be at least 5 characters',
    'any.required': 'Question text is required',
  }),
  questionType: Joi.string()
    .valid('multiple-choice', 'true-false', 'short-answer', 'long-answer', 'fill-in-blank')
    .required()
    .messages({
      'any.only': 'Invalid question type',
      'any.required': 'Question type is required',
    }),
  options: Joi.when('questionType', {
    is: 'multiple-choice',
    then: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().trim().min(1).required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .min(2)
      .max(6)
      .required()
      .messages({
        'array.min': 'Multiple choice question must have at least 2 options',
        'any.required': 'Options are required for multiple choice questions',
      }),
    otherwise: Joi.array().optional(),
  }),
  correctAnswer: Joi.when('questionType', {
    is: Joi.valid('true-false', 'short-answer', 'fill-in-blank'),
    then: Joi.string().trim().min(1).required().messages({
      'any.required': 'Correct answer is required for this question type',
    }),
    otherwise: Joi.string().optional().allow(''),
  }),
  marks: Joi.number().min(1).max(100).required().messages({
    'number.base': 'Marks must be a number',
    'number.min': 'Marks must be at least 1',
    'number.max': 'Marks cannot exceed 100',
    'any.required': 'Marks are required',
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  explanation: Joi.string().trim().max(2000).optional().allow(''),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
});

// ── Main question bank schema ─────────────────────────────────────────────────
const questionBankSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),
  subject: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Subject is required',
    'any.required': 'Subject is required',
  }),
  className: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Class name is required',
    'any.required': 'Class name is required',
  }),
  department: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Department is required',
    'any.required': 'Department is required',
  }),
  examType: Joi.string()
    .valid('unit-test', 'mid-term', 'final', 'assignment', 'quiz', 'practice')
    .required()
    .messages({
      'any.only': 'Invalid exam type',
      'any.required': 'Exam type is required',
    }),
  totalMarks: Joi.number().min(1).max(500).optional(),
  duration: Joi.number().min(5).max(300).optional().messages({
    'number.min': 'Duration must be at least 5 minutes',
    'number.max': 'Duration must not exceed 300 minutes',
  }),
  instructions: Joi.string().trim().max(2000).optional().allow(''),
  questions: Joi.array()
    .items(questionItemSchema)
    .min(1)
    .max(100)
    .required()
    .messages({
      'array.min': 'At least one question is required',
      'array.max': 'Cannot exceed 100 questions per question bank',
      'any.required': 'Questions array is required',
    }),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
  academicYear: Joi.string().trim().max(10).optional(),
});

// ── Middleware Factory ────────────────────────────────────────────────────────
const createValidator = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  req.validatedBody = value;
  next();
};

// ── Exports ───────────────────────────────────────────────────────────────────
const validateQuestion = createValidator(questionBankSchema);

module.exports = { validateQuestion };
