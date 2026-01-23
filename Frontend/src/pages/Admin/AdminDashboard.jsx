import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <div className="container app-shell">
      <div className="content-area">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="text-secondary mb-4">Create courses, sections and sessions.</p>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-semibold">Add Course</h5>
                <p className="text-secondary small">
                  Create a new course with title, description and thumbnail.
                </p>
                <Link className="btn btn-primary" to="/admin/courses/new">
                  Create course
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-semibold">Add Section</h5>
                <p className="text-secondary small">Add sections to an existing course.</p>
                <Link className="btn btn-primary" to="/admin/sections/new">
                  Create section
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-semibold">Add Session</h5>
                <p className="text-secondary small">
                  Add session content (video/pdf/ppt) under a section.
                </p>
                <Link className="btn btn-primary" to="/admin/sessions/new">
                  Create session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

