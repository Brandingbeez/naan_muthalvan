import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { listCourses, getCourse } from "../../services/lmsService";

export default function CourseListPage() {
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [parentCourse, setParentCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              <Link key={c._id} className="folder-button" to={`/courses/${c._id}`}>
                {c.title}
              </Link>
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

