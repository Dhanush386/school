const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  getAllBooks,
  searchBooks,
  issueBook,
  returnBook,
  getIssuedBooks,
  addBook,
  getEbooks,
  downloadEbook,
} = require('../controllers/libraryController');

// All routes require authentication
router.use(protect);

// ════════════════════════════════════════════════════════
//  PHYSICAL BOOK ROUTES
// ════════════════════════════════════════════════════════

/**
 * @route   GET /api/library/books/search
 * @desc    Search books by title, author, ISBN
 * @access  Private (all roles)
 */
router.get('/books/search', searchBooks);

/**
 * @route   GET /api/library/books
 * @desc    Get all books with pagination and filters
 * @access  Private (all roles)
 */
router.get('/books', getAllBooks);

/**
 * @route   POST /api/library/books
 * @desc    Admin adds a new book to the library
 * @access  Admin
 */
router.post(
  '/books',
  authorize('admin'),
  addBook
);

// ════════════════════════════════════════════════════════
//  ISSUE / RETURN ROUTES
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/library/issue
 * @desc    Admin issues a book to a student
 * @access  Admin
 */
router.post(
  '/issue',
  authorize('admin'),
  issueBook
);

/**
 * @route   POST /api/library/return/:issueId
 * @desc    Admin marks book as returned and calculates fine
 * @access  Admin
 */
router.post(
  '/return/:issueId',
  authorize('admin'),
  returnBook
);

/**
 * @route   GET /api/library/my-books
 * @desc    Student views their currently issued books
 * @access  Student
 */
router.get(
  '/my-books',
  authorize('student'),
  getIssuedBooks
);

/**
 * @route   GET /api/library/student/:studentId/books
 * @desc    Admin views issued books for a specific student
 * @access  Admin, Principal
 */
router.get(
  '/student/:studentId/books',
  authorize('admin', 'principal'),
  getIssuedBooks
);

// ════════════════════════════════════════════════════════
//  E-BOOK ROUTES
// ════════════════════════════════════════════════════════

/**
 * @route   GET /api/library/ebooks
 * @desc    Get all e-books
 * @access  Private (all roles)
 */
router.get('/ebooks', getEbooks);

/**
 * @route   GET /api/library/ebooks/:id/download
 * @desc    Download / serve an e-book file
 * @access  Private (all roles)
 */
router.get('/ebooks/:id/download', downloadEbook);

module.exports = router;

