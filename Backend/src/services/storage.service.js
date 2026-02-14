const { Storage } = require('@google-cloud/storage');
const path = require('path');

const {
  GCS_PROJECT_ID,
  GCS_BUCKET_NAME,
  GCS_KEYFILE_PATH,
  GCS_BASE_FOLDER = 'lms',
  GCS_SIGNED_URL_TTL_SECONDS = 900,
} = require('../config/env');

let storage = null;
let bucket = null;

const initializeGCS = () => {
  if (storage) return;

  const options = {
    projectId: GCS_PROJECT_ID,
  };

  // Use keyfile if path provided, otherwise rely on GOOGLE_APPLICATION_CREDENTIALS env var
  if (GCS_KEYFILE_PATH) {
    options.keyFilename = GCS_KEYFILE_PATH;
  }

  storage = new Storage(options);
  bucket = storage.bucket(GCS_BUCKET_NAME);
};

/**
 * Determine folder path based on file extension/mimetype
 */
const getResourceCategory = (originalName, mimeType) => {
  const ext = path.extname(originalName).toLowerCase().slice(1);
  const mimePrefix = mimeType.split('/')[0];

  if (
    ext === 'pdf' ||
    mimeType === 'application/pdf'
  ) {
    return 'pdf';
  }

  if (
    ['ppt', 'pptx'].includes(ext) ||
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return 'ppt';
  }

  if (
    ['doc', 'docx'].includes(ext) ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docs';
  }

  if (
    ['xls', 'xlsx'].includes(ext) ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return 'sheets';
  }

  if (
    ['mp4', 'webm'].includes(ext) ||
    mimeType.startsWith('video/')
  ) {
    return 'video';
  }

  throw new Error(`Unsupported file type: ${ext || mimeType}`);
};

/**
 * Sanitize filename for storage
 */
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^\.+/, '');
};

/**
 * Upload file to GCS
 * @param {Object} options
 * @param {Buffer} options.buffer - file buffer
 * @param {string} options.originalName - original filename
 * @param {string} options.mimeType - content type
 * @param {string} options.courseCode - course identifier
 * @param {string} options.subjectId - subject identifier
 * @param {string} options.sessionId - session identifier
 * @returns {Promise<Object>} storage metadata
 */
const uploadFile = async ({
  buffer,
  originalName,
  mimeType,
  courseCode,
  subjectId,
  sessionId,
}) => {
  initializeGCS();

  const category = getResourceCategory(originalName, mimeType);
  const sanitized = sanitizeFilename(originalName);
  const timestamp = Date.now();
  const objectName = `${GCS_BASE_FOLDER}/${courseCode}/${subjectId}/${sessionId}/${category}/${timestamp}_${sanitized}`;

  const file = bucket.file(objectName);

  try {
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName,
          uploadedAt: new Date().toISOString(),
          category,
        },
      },
    });

    return {
      gcsBucket: GCS_BUCKET_NAME,
      gcsObjectPath: objectName,
      gcsUri: `gs://${GCS_BUCKET_NAME}/${objectName}`,
      publicUrl: null, // GCS bucket is private
      mimeType,
      sizeBytes: buffer.length,
      originalFileName: originalName,
      category,
    };
  } catch (err) {
    console.error('GCS upload failed:', err);
    throw new Error(`Failed to upload file to GCS: ${err.message}`);
  }
};

/**
 * Generate a signed URL for reading/previewing
 * @param {string} gcsObjectPath - full object path in GCS
 * @param {number} ttlSeconds - time to live in seconds
 * @returns {Promise<string>} signed URL
 */
const getSignedPreviewUrl = async (gcsObjectPath, ttlSeconds = GCS_SIGNED_URL_TTL_SECONDS) => {
  initializeGCS();

  try {
    const file = bucket.file(gcsObjectPath);
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + ttlSeconds * 1000,
    });
    return signedUrl;
  } catch (err) {
    console.error('Failed to generate signed preview URL:', err);
    throw new Error(`Failed to generate signed URL: ${err.message}`);
  }
};

/**
 * Generate a signed URL for downloading with attachment header
 * @param {string} gcsObjectPath - full object path in GCS
 * @param {string} filename - display filename
 * @param {number} ttlSeconds - time to live in seconds
 * @returns {Promise<string>} signed URL for download
 */
const getSignedDownloadUrl = async (
  gcsObjectPath,
  filename,
  ttlSeconds = GCS_SIGNED_URL_TTL_SECONDS
) => {
  initializeGCS();

  try {
    const file = bucket.file(gcsObjectPath);
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + ttlSeconds * 1000,
      responseDisposition: `attachment; filename="${encodeURIComponent(filename)}"`,
    });
    return signedUrl;
  } catch (err) {
    console.error('Failed to generate signed download URL:', err);
    throw new Error(`Failed to generate download URL: ${err.message}`);
  }
};

/**
 * Delete file from GCS
 * @param {string} gcsObjectPath - full object path in GCS
 * @returns {Promise<void>}
 */
const deleteFile = async (gcsObjectPath) => {
  initializeGCS();

  try {
    await bucket.file(gcsObjectPath).delete();
  } catch (err) {
    console.error('Failed to delete file from GCS:', err);
    throw new Error(`Failed to delete file: ${err.message}`);
  }
};

module.exports = {
  uploadFile,
  getSignedPreviewUrl,
  getSignedDownloadUrl,
  deleteFile,
  getResourceCategory,
  sanitizeFilename,
};