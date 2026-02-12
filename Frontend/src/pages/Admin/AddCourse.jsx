import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../services/lmsService";
import { uploadThumbnail } from "../../services/uploadService";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", thumbnail: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleThumbnailChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setThumbnailFile(file);
    setError("");
    setUploadingThumbnail(true);

    try {
      const result = await uploadThumbnail(file);
      setForm({ ...form, thumbnail: result.url });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createCourse(form);
      navigate("/courses");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container app-shell" style={{ maxWidth: 720 }}>
      <div className="content-area">
        <h2 className="page-title">Add Course</h2>
        <p className="text-secondary mb-4">Create a course that users can access.</p>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <form onSubmit={onSubmit} className="vstack gap-3">
          <div>
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Thumbnail Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={uploadingThumbnail}
            />
            {uploadingThumbnail && <div className="form-text">Uploading...</div>}
            {form.thumbnail && !uploadingThumbnail && (
              <div className="mt-2">
                <img
                  src={form.thumbnail}
                  alt="Thumbnail preview"
                  style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
                <div className="form-text text-success">✓ Thumbnail uploaded to Cloudinary</div>
              </div>
            )}
            <div className="form-text">Upload a thumbnail image for this course (JPG, PNG, WEBP)</div>
          </div>
          <button className="btn btn-primary" disabled={loading || uploadingThumbnail}>
            {loading ? "Saving..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

