import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../state/AuthContext";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/courses";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      setAuth({ token: data.token, user: data.user });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container app-shell" style={{ maxWidth: 560 }}>
      <div className="content-area">
        <h3 className="fw-bold mb-1">Welcome back</h3>
        <p className="text-secondary mb-4">Login to continue to the LMS.</p>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <form onSubmit={onSubmit} className="vstack gap-3">
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
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <hr className="my-4" />
        <div className="small text-secondary">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

