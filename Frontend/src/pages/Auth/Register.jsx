import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { useAuth } from "../../state/AuthContext";

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form);
      setAuth({ token: data.token, user: data.user });
      navigate("/courses");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container app-shell" style={{ maxWidth: 560 }}>
      <div className="content-area">
        <h3 className="fw-bold mb-1">Create your account</h3>
        <p className="text-secondary mb-4">Start learning in minutes.</p>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <form onSubmit={onSubmit} className="vstack gap-3">
          <div>
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
            <div className="form-text">Minimum 6 characters.</div>
          </div>

          <div>
            <label className="form-label">Register as</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleUser"
                  value="user"
                  checked={form.role === "user"}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <label className="form-check-label" htmlFor="roleUser">
                  User
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleAdmin"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <label className="form-check-label" htmlFor="roleAdmin">
                  Admin
                </label>
              </div>
            </div>
            <div className="form-text">
              Select your account type. Admin accounts can create courses and manage content.
            </div>
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <hr className="my-4" />
        <div className="small text-secondary">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

