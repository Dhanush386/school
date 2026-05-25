/**
 * middleware/upload.js
 * Multer configuration for School ERP file uploads.
 *
 * Files are stored on disk under server/uploads/.
 * Supported file types: PDF documents and common image formats.
 *
 * Exports:
 *   uploadSingle(fieldName)       – single file upload
 *   uploadMultiple(fieldName, n)  – up to n files on the same field
 */

const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ---------------------------------------------------------------------------
// Ensure the uploads directory exists at startup
// ---------------------------------------------------------------------------
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Disk storage configuration
// ---------------------------------------------------------------------------
const storage = multer.diskStorage({
  /**
   * Destination folder for uploaded files.
   * Using a flat folder; you can add sub-folders per entity if needed.
   */
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  /**
   * Filename: timestamp + random suffix + original extension.
   * Avoids collisions without relying on the original (untrusted) name.
   */
  filename: (req, file, cb) => {
    const ext    = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, unique);
  },
});

// ---------------------------------------------------------------------------
// File type filter
// Accepts: PDF, PNG, JPG/JPEG, GIF, WEBP, SVG
// ---------------------------------------------------------------------------
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(
      `Unsupported file type: '${file.mimetype}'. ` +
      'Only PDFs and images (PNG, JPG, GIF, WEBP, SVG) are allowed.'
    );
    err.statusCode = 415; // Unsupported Media Type
    cb(err, false);
  }
};

// ---------------------------------------------------------------------------
// Base multer instance (10 MB size limit per file)
// ---------------------------------------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// ---------------------------------------------------------------------------
// Named exports
// ---------------------------------------------------------------------------

/**
 * Middleware for uploading a single file.
 * @param {string} fieldName – the multipart form field name
 */
const uploadSingle = (fieldName = 'file') => upload.single(fieldName);

/**
 * Middleware for uploading multiple files on the same field.
 * @param {string} fieldName – the multipart form field name
 * @param {number} maxCount  – maximum number of files (default 10)
 */
const uploadMultiple = (fieldName = 'files', maxCount = 10) =>
  upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
