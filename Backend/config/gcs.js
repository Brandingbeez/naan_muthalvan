// config/gcs.js
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");

let storage = null;
let bucket = null;

/**
 * Initialize Google Cloud Storage
 * Requires GOOGLE_APPLICATION_CREDENTIALS or GCS credentials in .env
 */
function initGCS() {
  try {
    const {
      GCS_PROJECT_ID,
      GCS_BUCKET_NAME,
      GCS_KEY_FILE,
      GCS_CREDENTIALS,
      GCP_SA_JSON,
    } = process.env;

    const CREDS_JSON = GCS_CREDENTIALS || GCP_SA_JSON;
    if (!GCS_PROJECT_ID || !GCS_BUCKET_NAME) {
      console.warn(
        "[GCS] GCS_PROJECT_ID or GCS_BUCKET_NAME not set. GCS uploads will be disabled.",
      );
      return null;
    }

    let storageConfig = {
      projectId: GCS_PROJECT_ID,
    };

    // Option 1: Use service account key file path
    if (GCS_KEY_FILE) {
      storageConfig.keyFilename = path.resolve(GCS_KEY_FILE);
      console.log("[GCS] Using key file:", storageConfig.keyFilename);
    }
    // Option 2: Use credentials JSON string from env (JSON / base64)
    else if (
      process.env.GCS_CREDENTIALS ||
      process.env.GCP_SA_JSON ||
      process.env.GCP_SA_JSON_B64
    ) {
      try {
        let raw =
          process.env.GCS_CREDENTIALS ||
          process.env.GCP_SA_JSON ||
          Buffer.from(process.env.GCP_SA_JSON_B64, "base64").toString("utf8");

        storageConfig.credentials = JSON.parse(raw);
        console.log("[GCS] Using credentials from env (JSON / base64)");
      } catch (err) {
        console.error("[GCS] Failed to parse credentials:", err.message);
        return null;
      }
    }
    // Option 3: Use default credentials (GOOGLE_APPLICATION_CREDENTIALS env var)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log("[GCS] Using GOOGLE_APPLICATION_CREDENTIALS");
    }
    // No credentials found
    else {
      console.warn(
        "[GCS] No credentials found. Set GCS_KEY_FILE, GCS_CREDENTIALS, or GOOGLE_APPLICATION_CREDENTIALS",
      );
      return null;
    }

    storage = new Storage(storageConfig);
    bucket = storage.bucket(GCS_BUCKET_NAME);

    // Test connection (non-blocking)
    bucket
      .exists()
      .then(([exists]) => {
        if (exists) {
          console.log(`[GCS] ✅ Connected to bucket: ${GCS_BUCKET_NAME}`);
        } else {
          console.warn(`[GCS] ⚠️  Bucket ${GCS_BUCKET_NAME} does not exist!`);
        }
      })
      .catch((err) => {
        console.warn("[GCS] ⚠️  Connection test failed:", err.message);
        console.warn(
          "[GCS] ⚠️  This might be a permission issue. Make sure your service account has 'Storage Admin' role.",
        );
        console.warn("[GCS] ⚠️  Server will continue, but file uploads may fail.");
      });

    return { storage, bucket };
  } catch (err) {
    console.error("[GCS] Initialization error:", err.message);
    return null;
  }
}

/**
 * Get GCS storage instance
 */
function getStorage() {
  if (!storage || !bucket) {
    const initialized = initGCS();
    if (!initialized) {
      throw new Error(
        "GCS not configured. Please set GCS_PROJECT_ID, GCS_BUCKET_NAME, and credentials in .env file.",
      );
    }
  }
  return { storage, bucket };
}

/**
 * Generate a file path based on course hierarchy
 * Format: lms/{contentType}/{courseSlug}/{sessionSlug}/{filename}
 */
function generateFilePath(courseTitle, sessionTitle, contentType = "videos", filename) {
  const sanitize = (str) =>
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

  const courseSlug = sanitize(courseTitle || "general");
  const sessionSlug = sanitize(sessionTitle || "session");
  return `lms/${contentType}/${courseSlug}/${sessionSlug}/${filename}`;
}

/**
 * Get public URL for a file in GCS bucket
 */
function getPublicUrl(filePath) {
  const { GCS_BUCKET_NAME } = process.env;
  if (!GCS_BUCKET_NAME) {
    throw new Error("GCS_BUCKET_NAME not configured");
  }
  return `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${filePath}`;
}

/**
 * Upload file to GCS (Buffer or Stream)
 * NOTE: Passing a huge Buffer can OOM your server.
 * Prefer uploadFileFromPath for large uploads (videos).
 */
async function uploadFile(fileBufferOrStream, destinationPath, contentType, metadata = {}) {
  const { bucket } = getStorage();
  const file = bucket.file(destinationPath);

  const stream = file.createWriteStream({
    metadata: {
      contentType,
      metadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
      },
    },
    // For large files, resumable is safer. Keeping default true here is fine.
    resumable: true,
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      console.error("[GCS] Upload error:", err);
      reject(err);
    });

    stream.on("finish", async () => {
      try {
        // Make file publicly readable (only if you want public playback)
        await file.makePublic();

        const url = getPublicUrl(destinationPath);
        console.log("[GCS] Upload successful:", url);

        // Cache headers + metadata
        await file.setMetadata({
          contentType,
          cacheControl: "public, max-age=3600",
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
          },
        });

        resolve({
          url,
          path: destinationPath,
          publicId: destinationPath,
        });
      } catch (err) {
        console.error("[GCS] Error making file public:", err);
        const url = getPublicUrl(destinationPath);
        console.warn(
          "[GCS] File might not be publicly accessible. Make sure bucket/object permissions are set correctly.",
        );
        resolve({
          url,
          path: destinationPath,
          publicId: destinationPath,
        });
      }
    });

    // Support Buffer OR readable stream
    if (fileBufferOrStream && typeof fileBufferOrStream.pipe === "function") {
      fileBufferOrStream.pipe(stream);
    } else {
      stream.end(fileBufferOrStream);
    }
  });
}

/**
 * ✅ NEW: Upload file to GCS from a local file path (streaming, OOM-safe)
 * Use this for large videos to avoid buffering into RAM.
 *
 * @param {string} localPath - temp file path on server (multer disk storage)
 * @param {string} destinationPath - Destination path in bucket
 * @param {string} contentType - MIME type
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<{url: string, path: string, publicId: string}>}
 */
async function uploadFileFromPath(localPath, destinationPath, contentType, metadata = {}) {
  const { bucket } = getStorage();
  const file = bucket.file(destinationPath);

  await new Promise((resolve, reject) => {
    fs.createReadStream(localPath)
      .pipe(
        file.createWriteStream({
          resumable: true,
          metadata: {
            contentType,
            metadata: {
              ...metadata,
              uploadedAt: new Date().toISOString(),
            },
          },
        }),
      )
      .on("error", (err) => {
        console.error("[GCS] Upload (from path) error:", err);
        reject(err);
      })
      .on("finish", resolve);
  });

  // Make public (only if desired)
  try {
    await file.makePublic();
  } catch (err) {
    console.warn("[GCS] makePublic failed (continuing):", err.message);
  }

  // Set metadata (non-fatal)
  try {
    await file.setMetadata({
      contentType,
      cacheControl: "public, max-age=3600",
      metadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn("[GCS] setMetadata failed (continuing):", err.message);
  }

  const url = getPublicUrl(destinationPath);
  console.log("[GCS] Upload (from path) successful:", url);

  return {
    url,
    path: destinationPath,
    publicId: destinationPath,
  };
}

/**
 * Delete file from GCS
 */
async function deleteFile(filePath) {
  const { bucket } = getStorage();
  try {
    await bucket.file(filePath).delete();
    console.log("[GCS] File deleted:", filePath);
  } catch (err) {
    console.error("[GCS] Delete error:", err.message);
    throw err;
  }
}

module.exports = {
  initGCS,
  getStorage,
  generateFilePath,
  getPublicUrl,
  uploadFile,
  uploadFileFromPath, // ✅ export new function
  deleteFile,
};
