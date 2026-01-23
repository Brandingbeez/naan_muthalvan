import { useEffect, useState } from "react";
import { createSection, listCourses } from "../../services/lmsService";

export default function AddSectionPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: "", title: "", order: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      const data = await listCourses();
      setCourses(data);
      if (data[0]?._id) setForm((f) => ({ ...f, courseId: data[0]._id }));
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await createSection({ ...form, order: Number(form.order || 0) });
      setSuccess("Section created");
      setForm((f) => ({ ...f, title: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h2 className="fw-bold mb-1">Add Section</h2>
      <p className="text-secondary">Add a section under a course.</p>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {success ? <div className="alert alert-success">{success}</div> : null}

      <form onSubmit={onSubmit} className="card shadow-sm border-0">
        <div className="card-body vstack gap-3">
          <div>
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              required
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            {courses.length === 0 ? (
              <div className="form-text">Create a course first.</div>
            ) : null}
          </div>

          <div>
            <label className="form-label">Section title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Order</label>
            <input
              className="form-control"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>

          <button className="btn btn-primary" disabled={loading || courses.length === 0}>
            {loading ? "Saving..." : "Create Section"}
          </button>
        </div>
      </form>
    </div>
  );
}

