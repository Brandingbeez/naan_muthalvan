const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

// File type configuration
const FILE_TYPES = {
  pdf: {
    mimes: ['application/pdf'],
    exts: ['.pdf'],
    maxSize: 50 * 1024 * 1024, 
  },
  ppt: {
    mimes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    exts: ['.ppt', '.pptx'],
    maxSize: 100 * 1024 * 1024, 
  },
  doc: {
    mimes: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    exts: ['.doc', '.docx'],
    maxSize: 25 * 1024 * 1024, 
  },
  xls: {
    mimes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    exts: ['.xls', '.xlsx'],
    maxSize: 50 * 1024 * 1024, 
  },
  video: {
    mimes: ['video/mp4', 'video/webm'],
    exts: ['.mp4', '.webm'],
    maxSize: 2000 * 1024 * 1024, 
  },
};

// Allowed mimes and extensions
const ALLOWED_MIMES = Object.values(FILE_TYPES)
  .flatMap((ft) => ft.mimes);
const ALLOWED_EXTS = Object.values(FILE_TYPES)
  .flatMap((ft) => ft.exts);

const validateFileType = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    return { valid: false, reason: `File extension ${ext} not allowed. Allowed: ${ALLOWED_EXTS.join(', ')}` };
  }

  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return { valid: false, reason: `MIME type ${file.mimetype} not allowed` };
  }

  return { valid: true };
};

const getMaxFileSizeForFile = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  for (const [, config] of Object.entries(FILE_TYPES)) {
    if (config.exts.includes(ext)) {
      return config.maxSize;
    }
  }
  return 25 * 1024 * 1024; 
};

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validation = validateFileType(file);
    if (!validation.valid) {
      return cb(new Error(`File validation failed: ${validation.reason}`), false);
    }
    cb(null, true);
  },
});

const uploadSingle = (fieldName = 'file') => upload.single(fieldName);

const fileGuard = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'File upload failed',
      errors: [{ field: 'file', message: 'No file uploaded' }],
    });
  }

  const maxSize = getMaxFileSizeForFile(req.file);
  if (req.file.size > maxSize) {
    return res.status(400).json({
      message: 'File validation failed',
      errors: [
        {
          field: 'file',
          message: `File size ${(req.file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
        },
      ],
    });
  }

  next();
};

/**
 * Error handler for multer
 */
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large',
        errors: [{ field: 'file', message: `File size exceeds maximum limit` }],
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files',
        errors: [{ field: 'file', message: 'Only one file allowed' }],
      });
    }
  }

  if (err && err.message.includes('File validation failed')) {
    return res.status(400).json({
      message: 'File validation failed',
      errors: [{ field: 'file', message: err.message }],
    });
  }

  next(err);
};

module.exports = {
  uploadSingle,
  fileGuard,
  multerErrorHandler,
  ALLOWED_EXTS,
  ALLOWED_MIMES,
  FILE_TYPES,
};