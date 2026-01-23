import { useEffect, useState } from "react";
import {
  createSession,
  listCourses,
  listSectionsByCourse,
  addContentToSession,
} from "../../services/lmsService";
import {
  uploadMultipleToCloudinary,
  uploadVideo,
  uploadPdf,
  uploadPpt,
} from "../../services/uploadService";

export default function AddSessionPage() {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    courseId: "",
    sectionId: "",
    title: "",
    description: "",
  });

  // Upload state for bulk files
  const [videoFiles, setVideoFiles] = useState([]);
  const [pptFiles, setPptFiles] = useState([]);
  const [materialFiles, setMaterialFiles] = useState([]);

  // Upload progress tracking
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedContent, setUploadedContent] = useState({
    videos: [],
    ppts: [],
    materials: [],
  });

  useEffect(() => {
    (async () => {
      const data = await listCourses();
      setCourses(data);
      if (data[0]?._id) {
        setForm((f) => ({ ...f, courseId: data[0]._id }));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!form.courseId) return;
      const secs = await listSectionsByCourse(form.courseId);
      const sorted = [...secs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setSections(sorted);
      if (sorted[0]?._id) {
        setForm((f) => ({ ...f, sectionId: sorted[0]._id || "" }));
      }
    })();
  }, [form.courseId]);

  // Get course and section titles for folder organization
  const getCourseTitle = () => {
    return courses.find((c) => c._id === form.courseId)?.title || "";
  };

  const getSectionTitle = () => {
    return sections.find((s) => s._id === form.sectionId)?.title || "";
  };

  // Handle file selection (multiple files)
  function handleVideoFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setVideoFiles(files);
  }

  function handlePptFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setPptFiles(files);
  }

  function handleMaterialFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setMaterialFiles(files);
  }

  // Upload videos in bulk
  async function handleBulkVideoUpload() {
    if (videoFiles.length === 0) return;

    setUploading(true);
    setError("");
    const courseTitle = getCourseTitle();
    const sessionTitle = form.title || "session";

    try {
      const { results, errors } = await uploadMultipleToCloudinary(videoFiles, {
        resourceType: "video",
        courseTitle,
        sessionTitle,
        contentType: "videos",
        onFileProgress: (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [`video-${fileIndex}`]: progress,
          }));
        },
        onFileComplete: (fileIndex, result) => {
          console.log(`Video ${fileIndex} uploaded:`, result);
        },
      });

      setUploadedContent((prev) => ({
        ...prev,
        videos: [...prev.videos, ...results],
      }));

      if (errors.length > 0) {
        setError(`Some videos failed to upload: ${errors.map((e) => e.fileName).join(", ")}`);
      } else {
        setSuccess(`${results.length} video(s) uploaded successfully!`);
      }
    } catch (err) {
      setError(err?.message || "Failed to upload videos");
    } finally {
      setUploading(false);
      setVideoFiles([]);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        videoFiles.forEach((_, i) => delete newProgress[`video-${i}`]);
        return newProgress;
      });
    }
  }

  // Upload PPTs in bulk
  async function handleBulkPptUpload() {
    if (pptFiles.length === 0) return;

    setUploading(true);
    setError("");
    const courseTitle = getCourseTitle();
    const sessionTitle = form.title || "session";

    try {
      const { results, errors } = await uploadMultipleToCloudinary(pptFiles, {
        resourceType: "raw",
        courseTitle,
        sessionTitle,
        contentType: "ppts",
        onFileProgress: (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [`ppt-${fileIndex}`]: progress,
          }));
        },
      });

      setUploadedContent((prev) => ({
        ...prev,
        ppts: [...prev.ppts, ...results],
      }));

      if (errors.length > 0) {
        setError(`Some PPTs failed to upload: ${errors.map((e) => e.fileName).join(", ")}`);
      } else {
        setSuccess(`${results.length} PPT(s) uploaded successfully!`);
      }
    } catch (err) {
      setError(err?.message || "Failed to upload PPTs");
    } finally {
      setUploading(false);
      setPptFiles([]);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        pptFiles.forEach((_, i) => delete newProgress[`ppt-${i}`]);
        return newProgress;
      });
    }
  }

  // Upload materials in bulk
  async function handleBulkMaterialUpload() {
    if (materialFiles.length === 0) return;

    setUploading(true);
    setError("");
    const courseTitle = getCourseTitle();
    const sessionTitle = form.title || "session";

    try {
      const { results, errors } = await uploadMultipleToCloudinary(materialFiles, {
        resourceType: "raw",
        courseTitle,
        sessionTitle,
        contentType: "materials",
        onFileProgress: (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [`material-${fileIndex}`]: progress,
          }));
        },
      });

      setUploadedContent((prev) => ({
        ...prev,
        materials: [...prev.materials, ...results],
      }));

      if (errors.length > 0) {
        setError(`Some materials failed to upload: ${errors.map((e) => e.fileName).join(", ")}`);
      } else {
        setSuccess(`${results.length} material(s) uploaded successfully!`);
      }
    } catch (err) {
      setError(err?.message || "Failed to upload materials");
    } finally {
      setUploading(false);
      setMaterialFiles([]);
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        materialFiles.forEach((_, i) => delete newProgress[`material-${i}`]);
        return newProgress;
      });
    }
  }

  // Create session with uploaded content
  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Create session first
      const session = await createSession({
        sectionId: form.sectionId,
        title: form.title,
        description: form.description,
        videos: uploadedContent.videos.map((v) => ({
          title: v.title,
          videoUrl: v.url,
          publicId: v.publicId,
          duration: v.duration || "",
          order: v.order,
          bytes: v.size,
        })),
        ppts: uploadedContent.ppts.map((p) => ({
          title: p.title,
          pptUrl: p.url,
          publicId: p.publicId,
          order: p.order,
          bytes: p.size,
        })),
        materials: uploadedContent.materials.map((m) => ({
          title: m.title,
          materialUrl: m.url,
          publicId: m.publicId,
          order: m.order,
          bytes: m.size,
        })),
      });

      setSuccess(`Session "${form.title}" created successfully with ${uploadedContent.videos.length} video(s), ${uploadedContent.ppts.length} PPT(s), and ${uploadedContent.materials.length} material(s)!`);

      // Reset form
      setForm({ courseId: form.courseId, sectionId: form.sectionId, title: "", description: "" });
      setUploadedContent({ videos: [], ppts: [], materials: [] });
      setVideoFiles([]);
      setPptFiles([]);
      setMaterialFiles([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

  return (
    <div className="container app-shell" style={{ maxWidth: 1000 }}>
      <div className="content-area">
        <h2 className="page-title">Add Session</h2>
        <p className="text-secondary mb-4">
          Create a session and upload multiple videos, PPTs, and study materials. Files upload directly to Cloudinary.
        </p>

        {error ? <div className="alert alert-danger">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        <form onSubmit={onSubmit} className="vstack gap-4">
          {/* Basic Session Info */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Course</label>
              <select
                className="form-select"
                value={form.courseId}
                onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value, sectionId: "" }))}
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={form.sectionId}
                onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
                required
                disabled={!form.courseId}
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.title}
                  </option>
                ))}
              </select>
              {sections.length === 0 && form.courseId ? (
                <div className="form-text text-warning">Create a section first for this course.</div>
              ) : null}
            </div>
          </div>

          <div>
            <label className="form-label">Session Title *</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Facebook Campaigns"
              required
            />
          </div>

          <div>
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Brief description of this session..."
            />
          </div>

          {/* Bulk Video Upload */}
          <div className="border rounded p-3">
            <h5 className="mb-3">📹 Videos (Bulk Upload)</h5>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="video/*"
                multiple
                onChange={handleVideoFilesChange}
                disabled={uploading}
              />
              <div className="form-text">
                Select multiple video files (MP4, WebM, MOV). Each file can be up to 1GB. Uploads go directly to Cloudinary.
              </div>
            </div>

            {videoFiles.length > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">
                    {videoFiles.length} file(s) selected
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleBulkVideoUpload}
                    disabled={uploading || !form.title}
                  >
                    {uploading ? "Uploading..." : `Upload ${videoFiles.length} Video(s)`}
                  </button>
                </div>
                <div className="small">
                  {videoFiles.map((file, idx) => (
                    <div key={idx} className="mb-1">
                      {file.name} ({formatFileSize(file.size)})
                      {uploadProgress[`video-${idx}`] !== undefined && (
                        <div className="progress" style={{ height: "4px", marginTop: "4px" }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${uploadProgress[`video-${idx}`]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedContent.videos.length > 0 && (
              <div className="alert alert-success small">
                <strong>✓ {uploadedContent.videos.length} video(s) uploaded:</strong>
                <ul className="mb-0 mt-2">
                  {uploadedContent.videos.map((v, idx) => (
                    <li key={idx}>{v.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bulk PPT Upload */}
          <div className="border rounded p-3">
            <h5 className="mb-3">📊 PPTs (Bulk Upload)</h5>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".ppt,.pptx"
                multiple
                onChange={handlePptFilesChange}
                disabled={uploading}
              />
              <div className="form-text">Select multiple PPT/PPTX files.</div>
            </div>

            {pptFiles.length > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">
                    {pptFiles.length} file(s) selected
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleBulkPptUpload}
                    disabled={uploading || !form.title}
                  >
                    {uploading ? "Uploading..." : `Upload ${pptFiles.length} PPT(s)`}
                  </button>
                </div>
                <div className="small">
                  {pptFiles.map((file, idx) => (
                    <div key={idx} className="mb-1">
                      {file.name} ({formatFileSize(file.size)})
                      {uploadProgress[`ppt-${idx}`] !== undefined && (
                        <div className="progress" style={{ height: "4px", marginTop: "4px" }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${uploadProgress[`ppt-${idx}`]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedContent.ppts.length > 0 && (
              <div className="alert alert-success small">
                <strong>✓ {uploadedContent.ppts.length} PPT(s) uploaded:</strong>
                <ul className="mb-0 mt-2">
                  {uploadedContent.ppts.map((p, idx) => (
                    <li key={idx}>{p.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bulk Material Upload */}
          <div className="border rounded p-3">
            <h5 className="mb-3">📄 Study Materials (Bulk Upload)</h5>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                multiple
                onChange={handleMaterialFilesChange}
                disabled={uploading}
              />
              <div className="form-text">Select multiple PDF files.</div>
            </div>

            {materialFiles.length > 0 && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small text-muted">
                    {materialFiles.length} file(s) selected
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleBulkMaterialUpload}
                    disabled={uploading || !form.title}
                  >
                    {uploading ? "Uploading..." : `Upload ${materialFiles.length} Material(s)`}
                  </button>
                </div>
                <div className="small">
                  {materialFiles.map((file, idx) => (
                    <div key={idx} className="mb-1">
                      {file.name} ({formatFileSize(file.size)})
                      {uploadProgress[`material-${idx}`] !== undefined && (
                        <div className="progress" style={{ height: "4px", marginTop: "4px" }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${uploadProgress[`material-${idx}`]}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedContent.materials.length > 0 && (
              <div className="alert alert-success small">
                <strong>✓ {uploadedContent.materials.length} material(s) uploaded:</strong>
                <ul className="mb-0 mt-2">
                  {uploadedContent.materials.map((m, idx) => (
                    <li key={idx}>{m.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={
              loading ||
              courses.length === 0 ||
              sections.length === 0 ||
              uploading ||
              !form.title ||
              !form.sectionId ||
              (uploadedContent.videos.length === 0 &&
                uploadedContent.ppts.length === 0 &&
                uploadedContent.materials.length === 0)
            }
          >
            {loading ? "Creating Session..." : "Create Session"}
          </button>

          <div className="form-text text-center">
            <strong>Summary:</strong> {uploadedContent.videos.length} video(s),{" "}
            {uploadedContent.ppts.length} PPT(s), {uploadedContent.materials.length} material(s)
            ready to save.
          </div>
        </form>
      </div>
    </div>
  );
}
