const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// Schema 1: Book
// ─────────────────────────────────────────────────────────────────────────────
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    publisher: {
      type: String,
      trim: true,
      default: null,
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Published year seems too early'],
      max: [new Date().getFullYear(), 'Published year cannot be in the future'],
      default: null,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [0, 'Total copies cannot be negative'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      min: [0, 'Available copies cannot be negative'],
      default: 1,
    },
    location: {
      type: String,
      trim: true,
      default: null, // shelf/rack info
    },
    coverImage: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isEbook: {
      type: Boolean,
      default: false,
    },
    ebookFile: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ availableCopies: 1 });

const Book = mongoose.model('Book', bookSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 2: BookIssue
// ─────────────────────────────────────────────────────────────────────────────
const bookIssueSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
      min: [0, 'Fine cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['issued', 'returned', 'overdue'],
        message: 'Status must be one of: issued, returned, overdue',
      },
      default: 'issued',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: auto-set overdue status ───────────────────────────────────────
bookIssueSchema.pre('save', function (next) {
  if (this.status === 'issued' && this.dueDate && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

bookIssueSchema.index({ studentId: 1, status: 1 });
bookIssueSchema.index({ bookId: 1, status: 1 });
bookIssueSchema.index({ dueDate: 1, status: 1 });

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

// ─────────────────────────────────────────────────────────────────────────────
module.exports = { Book, BookIssue };
