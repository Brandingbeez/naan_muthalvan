import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { listCourses, getCourse, deleteCourse } from "../../services/lmsService";
import { useAuth } from "../../state/AuthContext";

export default function CourseListPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [courses, setCourses] = useState([]);
  const [parentCourse, setParentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleDelete(id, title) {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? This will delete all sections and sessions inside it.`)) {
      return;
    }
    try {
      await deleteCourse(id);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete course");
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (courseId) {
          // Load children of a specific course
          const [children, parent] = await Promise.all([
            listCourses(courseId),
            getCourse(courseId),
          ]);
          if (mounted) {
            setCourses(children);
            setParentCourse(parent);
          }
        } else {
          // Load top-level courses
          const data = await listCourses();
          if (mounted) setCourses(data);
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  // Build breadcrumb
  const breadcrumbItems = [{ label: "Academy", path: "/courses" }];
  if (parentCourse) {
    breadcrumbItems.push({ label: parentCourse.title, path: `/courses/${parentCourse._id}` });
  }

  const pageTitle = parentCourse ? parentCourse.title : "Academy";

  return (
    <div className="container app-shell">
      {parentCourse && <Breadcrumb items={breadcrumbItems} />}
      <div className="content-area">
        <h2 className="page-title">{pageTitle}</h2>

        {loading ? <Loading label="Loading..." /> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="folder-grid">
          {courses.map((c) => {
            // Handle Knowvaa external link
            if (c.title === "Knowvaa") {
              return (
                <a
                  key={c._id}
                  className="folder-button"
                  href="https://www.knowvaa.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {c.title}
                </a>
              );
            }
            return (
              <div key={c._id} className="position-relative">
                <Link className="folder-button d-block" to={`/courses/${c._id}`}>
                  {c.title}
                </Link>
                {isAdmin && (
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    style={{ zIndex: 10, borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(c._id, c.title);
                    }}
                    title="Delete Course"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            );
          })}
          {!loading && !error && courses.length === 0 ? (
            <div className="alert alert-info mb-0">No items yet.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

