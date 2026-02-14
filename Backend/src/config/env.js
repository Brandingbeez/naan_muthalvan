require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NM_PARTNER_BEARER_TOKEN: process.env.NM_PARTNER_BEARER_TOKEN,
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'gcs',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  NM_CLIENT_ID: process.env.NM_CLIENT_ID,
  NM_CLIENT_SECRET: process.env.NM_CLIENT_SECRET,
  NM_BASE_URL: process.env.NM_BASE_URL,
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID,
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
  GCS_KEYFILE_PATH: process.env.GCS_KEYFILE_PATH,
  GCS_BASE_FOLDER: process.env.GCS_BASE_FOLDER || 'lms',
  GCS_SIGNED_URL_TTL_SECONDS: parseInt(process.env.GCS_SIGNED_URL_TTL_SECONDS || '900', 10),
  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
};