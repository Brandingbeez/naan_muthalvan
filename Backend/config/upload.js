const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { uploadFileFromPath, generateFilePath } = require("./gcs");

// Use /tmp on Linux (Fly), temp dir on Windows/local
const TMP_DIR = process.env.TMPDIR || path.join(os.tmpdir(), "lms_uploads");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

// Disk storage (NOT memory)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, TMP_DIR),
  filename: (req, file, cb) => {
    const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = (file.originalname || "file")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    cb(null, `${uniqueId}-${sanitizedName}`);
  },
});

/**
 * Create a multer uploader middleware for GCS (disk -> stream to GCS)
 */
function makeUploader({ folder, allowedMimes, allowedExts, maxSizeMb }) {
  const maxSize = (maxSizeMb || 50) * 1024 * 1024;

  const uploader = multer({
    storage: diskStorage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      const mimeOk = !allowedMimes || allowedMimes.includes(file.mimetype);

      // Extension fallback (for octet-stream cases)
      const name = (file.originalname || "").toLowerCase();
      const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
      const extOk = Array.isArray(allowedExts) ? allowedExts.includes(ext) : true;

      if (!mimeOk && !extOk) {
        return cb(
          new Error(
            `Invalid file type: ${file.mimetype}. Allowed mimes: ${allowedMimes?.join(", ") || "any"}${
              allowedExts?.length ? `. Allowed extensions: .${allowedExts.join(", .")}` : ""
            }`
          )
        );
      }

      cb(null, true);
    },
  });

  return (req, res, next) => {
    uploader.single("file")(req, res, async (err) => {
      if (err) {
        console.error("[Upload] Multer error:", err.message);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: `File too large. Maximum size: ${maxSizeMb}MB`,
          });
        }
        return next(err);
      }

      if (!req.file) return next();

      try {
        // Optional: course/session info from form-data
        const courseTitle = req.body.courseTitle;
        const sessionTitle = req.body.sessionTitle;

        // Build GCS path
        let filePath;
        if (courseTitle && sessionTitle) {
          filePath = generateFilePath(courseTitle, sessionTitle, folder, req.file.filename);
        } else {
          filePath = `lms/${folder}/${req.file.filename}`;
        }

        console.log("[Upload] Temp file:", req.file.path);
        console.log("[Upload] Uploading to GCS:", filePath);

        // Stream file from disk -> GCS (NO big memory buffer)
        const result = await uploadFileFromPath(
          req.file.path,
          filePath,
          req.file.mimetype,
          {
            originalName: req.file.originalname,
            uploadedBy: req.user?.email || "unknown",
          }
        );

        // Cleanup temp file
        fs.unlink(req.file.path, () => {});

        // Attach result to req.file (compatible with your controller)
        req.file.path = result.url;
        req.file.filename = result.path;
        req.file.publicId = result.publicId;
        req.file.url = result.url;

        console.log("[Upload] GCS upload successful:", result.url);
        next();
      } catch (gcsError) {
        console.error("[Upload] GCS upload error:", gcsError.message);

        // Cleanup temp file on error too
        if (req.file?.path) fs.unlink(req.file.path, () => {});

        return res.status(500).json({
          message: `Failed to upload file to Google Cloud Storage: ${gcsError.message}`,
        });
      }
    });
  };
}

module.exports = { makeUploader };
