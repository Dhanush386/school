const path = require('path');
const Book = require('../models/Library').Book;
const BookIssue = require('../models/Library').BookIssue;
const Notification = require('../models/Notification');
const User = require('../models/User');

const FINE_PER_DAY = 2; // ₹2 per day overdue

// ── @desc    Get all books with pagination and search
// ── @route   GET /api/library/books?search=&page=&limit=
// ── @access  Private
const getAllBooks = async (req, res) => {
  try {
    const { search, category, subject, page = 1, limit = 15 } = req.query;
    const filter = { isEbook: { $ne: true } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort({ title: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: books,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllBooks error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Search books by title / author / isbn
// ── @route   GET /api/library/books/search?q=
// ── @access  Private
const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q.trim(), $options: 'i' } },
        { author: { $regex: q.trim(), $options: 'i' } },
        { isbn: { $regex: q.trim(), $options: 'i' } },
        { subject: { $regex: q.trim(), $options: 'i' } },
      ],
    }).limit(30);

    return res.status(200).json({ success: true, data: books, count: books.length });
  } catch (error) {
    console.error('searchBooks error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin issues a book to a student
// ── @route   POST /api/library/issue
// ── @access  Admin
const issueBook = async (req, res) => {
  try {
    const { studentId, bookId, dueDays = 14 } = req.body;

    if (!studentId || !bookId) {
      return res.status(400).json({ success: false, message: 'studentId and bookId are required' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies available for this book' });
    }

    // Check if student already has this book
    const existing = await BookIssue.findOne({ student: studentId, book: bookId, returnDate: null });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student already has this book issued' });
    }

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + dueDays * 24 * 60 * 60 * 1000);

    const issue = await BookIssue.create({
      student: studentId,
      book: bookId,
      issuedBy: req.user.id,
      issueDate,
      dueDate,
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // Notify student
    await Notification.create({
      recipient: studentId,
      type: 'book_issued',
      title: 'Book Issued',
      message: `"${book.title}" has been issued to you. Due date: ${dueDate.toLocaleDateString('en-IN')}.`,
      relatedId: issue._id,
      relatedModel: 'BookIssue',
    });

    return res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      data: { ...issue.toObject(), book, student: { name: student.name, loginId: student.loginId } },
    });
  } catch (error) {
    console.error('issueBook error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin marks book return, calculates fine
// ── @route   POST /api/library/return/:issueId
// ── @access  Admin
const returnBook = async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.issueId).populate('book').populate('student', 'name loginId');

    if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found' });

    if (issue.returnDate) {
      return res.status(400).json({ success: false, message: 'Book has already been returned' });
    }

    const returnDate = new Date();
    const dueDate = new Date(issue.dueDate);
    let fine = 0;

    if (returnDate > dueDate) {
      const overdueDays = Math.ceil((returnDate - dueDate) / (24 * 60 * 60 * 1000));
      fine = overdueDays * FINE_PER_DAY;
    }

    issue.returnDate = returnDate;
    issue.fine = fine;
    issue.finePaid = fine === 0;
    issue.returnedTo = req.user.id;
    await issue.save();

    // Restore available copies
    await Book.findByIdAndUpdate(issue.book._id, { $inc: { availableCopies: 1 } });

    // Notify student if there's a fine
    if (fine > 0) {
      await Notification.create({
        recipient: issue.student._id,
        type: 'book_fine',
        title: 'Library Fine Incurred',
        message: `You returned "${issue.book.title}" ${Math.ceil((returnDate - dueDate) / 86400000)} days late. Fine: ₹${fine}.`,
        relatedId: issue._id,
        relatedModel: 'BookIssue',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: { issueId: issue._id, fine, returnDate },
    });
  } catch (error) {
    console.error('returnBook error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get student's currently issued books
// ── @route   GET /api/library/my-books
// ── @access  Student
const getIssuedBooks = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;
    const { includeReturned = false } = req.query;

    const filter = { student: studentId };
    if (!includeReturned || includeReturned === 'false') filter.returnDate = null;

    const issues = await BookIssue.find(filter)
      .populate('book', 'title author isbn subject publisher')
      .sort({ issueDate: -1 });

    const today = new Date();
    const enriched = issues.map(issue => ({
      ...issue.toObject(),
      isOverdue: !issue.returnDate && today > new Date(issue.dueDate),
      overdueDays: !issue.returnDate && today > new Date(issue.dueDate)
        ? Math.ceil((today - new Date(issue.dueDate)) / 86400000)
        : 0,
      estimatedFine: !issue.returnDate && today > new Date(issue.dueDate)
        ? Math.ceil((today - new Date(issue.dueDate)) / 86400000) * FINE_PER_DAY
        : 0,
    }));

    return res.status(200).json({ success: true, data: enriched, count: enriched.length });
  } catch (error) {
    console.error('getIssuedBooks error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin adds a new book
// ── @route   POST /api/library/books
// ── @access  Admin
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, subject, totalCopies, publisher, publicationYear, category, description, isEbook, ebookFilename } = req.body;

    if (!title || !author || !totalCopies) {
      return res.status(400).json({ success: false, message: 'title, author and totalCopies are required' });
    }

    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ success: false, message: 'A book with this ISBN already exists' });
      }
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      subject,
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
      publisher,
      publicationYear,
      category,
      description,
      isEbook: isEbook || false,
      ebookFilename,
      addedBy: req.user.id,
    });

    return res.status(201).json({ success: true, message: 'Book added successfully', data: book });
  } catch (error) {
    console.error('addBook error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get all e-books
// ── @route   GET /api/library/ebooks
// ── @access  Private
const getEbooks = async (req, res) => {
  try {
    const { subject, page = 1, limit = 15 } = req.query;
    const filter = { isEbook: true };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };

    const total = await Book.countDocuments(filter);
    const ebooks = await Book.find(filter)
      .sort({ title: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: ebooks,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getEbooks error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Download/serve an e-book file
// ── @route   GET /api/library/ebooks/:id/download
// ── @access  Private
const downloadEbook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.isEbook) {
      return res.status(404).json({ success: false, message: 'E-book not found' });
    }

    if (!book.ebookFilename) {
      return res.status(404).json({ success: false, message: 'E-book file not available' });
    }

    const ebookPath = path.join(__dirname, '..', 'uploads', 'ebooks', book.ebookFilename);
    return res.download(ebookPath, book.ebookFilename, (err) => {
      if (err) {
        console.error('Ebook download error:', err);
        return res.status(500).json({ success: false, message: 'Could not download e-book' });
      }
    });
  } catch (error) {
    console.error('downloadEbook error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllBooks,
  searchBooks,
  issueBook,
  returnBook,
  getIssuedBooks,
  addBook,
  getEbooks,
  downloadEbook,
};

