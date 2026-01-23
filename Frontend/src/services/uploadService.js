import { api } from "./api";

/**
 * Upload files to Google Cloud Storage via backend
 * Files are uploaded to backend, which then stores them in GCS
 */

/**
 * Upload file to backend (which uploads to GCS)
 * @param {File} file - File to upload
 * @param {string} endpoint - Upload endpoint (e.g., "/uploads/video")
 * @param {Function} onProgress - Progress callback (progress: 0-100)
 * @returns {Promise<Object>} Upload result with url, publicId, etc.
 */
async function uploadFileToBackend(endpoint, file, courseTitle = "", sessionTitle = "", onProgress = null) {
  const formData = new FormData();
  formData.append("file", file);
  if (courseTitle) formData.append("courseTitle", courseTitle);
  if (sessionTitle) formData.append("sessionTitle", sessionTitle);

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Get token from localStorage
    const token = (() => {
      try {
        const raw = localStorage.getItem("lms_auth");
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed?.token || null;
      } catch {
        return null;
      }
    })();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      });
    }

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.url,
            publicId: response.publicId || response.path,
            originalName: response.originalName || file.name,
            resourceType: response.resourceType || "file",
            size: response.size || file.size,
            duration: response.duration || "",
          });
        } catch (err) {
          reject(new Error("Failed to parse server response"));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || `Upload failed: ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    // Start upload
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    xhr.open("POST", `${baseURL}${endpoint}`);
    
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    
    xhr.send(formData);
  });
}

/**
 * Upload multiple files to GCS (via backend)
 * @param {File[]} files - Array of files to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of upload results
 */
export async function uploadMultipleToCloudinary(files, options = {}) {
  const {
    resourceType = "video",
    courseTitle = "",
    sessionTitle = "",
    contentType = "videos",
    onFileProgress = null,
    onFileComplete = null,
  } = options;

  // Determine endpoint based on resource type
  let endpoint = "/uploads/video";
  if (contentType === "materials" || resourceType === "raw") {
    endpoint = "/uploads/pdf";
  } else if (contentType === "ppts") {
    endpoint = "/uploads/ppt";
  } else if (contentType === "thumbnails") {
    endpoint = "/uploads/thumbnail";
  }

  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const progressCallback = onFileProgress
        ? (progress) => onFileProgress(i, progress)
        : null;

      const result = await uploadFileToBackend(endpoint, file, courseTitle, sessionTitle, progressCallback);

      results.push({
        ...result,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for title
        order: i,
      });

      if (onFileComplete) {
        onFileComplete(i, result);
      }
    } catch (err) {
      errors.push({ index: i, fileName: file.name, error: err.message });
    }
  }

  if (errors.length > 0) {
    console.warn("Some uploads failed:", errors);
  }

  return { results, errors };
}

// Legacy functions (kept for backward compatibility)
export async function uploadThumbnail(file, onProgress = null) {
  return uploadFileToBackend("/uploads/thumbnail", file, "", "", onProgress);
}

export async function uploadPdf(file, courseTitle = "", sessionTitle = "", onProgress = null) {
  return uploadFileToBackend("/uploads/pdf", file, courseTitle, sessionTitle, onProgress);
}

export async function uploadPpt(file, courseTitle = "", sessionTitle = "", onProgress = null) {
  return uploadFileToBackend("/uploads/ppt", file, courseTitle, sessionTitle, onProgress);
}

export async function uploadVideo(file, courseTitle = "", sessionTitle = "", onProgress = null) {
  return uploadFileToBackend("/uploads/video", file, courseTitle, sessionTitle, onProgress);
}
