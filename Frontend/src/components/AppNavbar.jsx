import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function AppNavbar() {
  const { isAuthed, role, user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-white border-bottom sticky-top" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="container app-shell">
        <nav className="navbar navbar-expand-lg py-3">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/courses">
            <span style={{ fontSize: 20 }}>🐝</span>
            <span>BrandingBeez Academy</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/courses">
                  Courses
                </NavLink>
              </li>
              {role === "admin" ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                </li>
              ) : null}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {isAuthed ? (
                <>
                  <span className="small text-secondary d-none d-md-inline">
                    {user?.name} <span className="badge text-bg-light border">{role}</span>
                  </span>
                  <button className="btn btn-outline-primary btn-sm" onClick={onLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink className="btn btn-outline-primary btn-sm" to="/login">
                    Login
                  </NavLink>
                  <NavLink className="btn btn-primary btn-sm" to="/register">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

