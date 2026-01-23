import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { getCourse, listCourses, listSectionsByCourse, listSessionsBySection } from "../../services/lmsService";

export default function CourseDetailsPage() {
  const { courseId, subCourseId } = useParams();
  const navigate = useNavigate();
  const actualCourseId = subCourseId || courseId;
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSectionId = searchParams.get("section") || "";

  const [course, setCourse] = useState(null);
  const [parentCourse, setParentCourse] = useState(null);
  const [childCourses, setChildCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState("");

  const selectedSection = useMemo(
    () => sections.find((s) => s._id === selectedSectionId) || null,
    [sections, selectedSectionId]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const c = await getCourse(actualCourseId);
        if (!mounted) return;
        setCourse(c);

        // Check if this course has children (subcategories/courses)
        const children = await listCourses(actualCourseId);
        if (children.length > 0) {
          // This is a category/subcategory - show children
          setChildCourses(children);
          setLoading(false);
          return;
        }

        // Check if this course has sections (actual course with content)
        const secs = await listSectionsByCourse(actualCourseId);
        const sorted = [...secs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSections(sorted);
        if (!selectedSectionId && sorted[0]?._id) {
          setSearchParams({ section: sorted[0]._id });
        }

        // Load parent course if exists
        if (c.parentId) {
          const parent = await getCourse(c.parentId);
          if (mounted) setParentCourse(parent);
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load course");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [actualCourseId, selectedSectionId, setSearchParams, courseId, subCourseId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!selectedSectionId) return;
      try {
        setLoadingSessions(true);
        const sess = await listSessionsBySection(selectedSectionId);
        if (!mounted) return;
        setSessions(sess);
      } catch (err) {
        // keep the main error area for course; show a small alert below
      } finally {
        if (mounted) setLoadingSessions(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedSectionId]);

  if (loading) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <Loading label="Loading..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <div className="alert alert-danger">{error}</div>
          <Link to="/courses" className="btn btn-outline-primary">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  // If this course has children (subcategories), show them as folder buttons
  if (childCourses.length > 0 && sections.length === 0) {
    const breadcrumbItems = [{ label: "Academy", path: "/courses" }];
    if (parentCourse) {
      breadcrumbItems.push({ label: parentCourse.title, path: `/courses/${parentCourse._id}` });
    }
    breadcrumbItems.push({ label: course?.title || "Course", path: "" });

    return (
      <div className="container app-shell">
        {parentCourse && <Breadcrumb items={breadcrumbItems} />}
        <div className="content-area">
          <h2 className="page-title">{course?.title}</h2>
          <div className="folder-grid">
            {childCourses.map((c) => (
              <Link key={c._id} className="folder-button" to={`/courses/${courseId}/${c._id}`}>
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // This is an actual course with sections and sessions
  const breadcrumbItems = [{ label: "Academy", path: "/courses" }];
  if (parentCourse) {
    breadcrumbItems.push({ label: parentCourse.title, path: `/courses/${parentCourse._id}` });
  }
  breadcrumbItems.push({ label: course?.title || "Course", path: `/courses/${actualCourseId}` });
  if (selectedSection) {
    breadcrumbItems.push({ label: selectedSection.title, path: "" });
  }

  return (
    <div className="container app-shell">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="content-area">
        <div className="row">
          <aside className="col-12 col-lg-3 border-end" style={{ paddingRight: 20 }}>
            <div>
              <Link
                to={parentCourse ? `/courses/${parentCourse._id}` : "/courses"}
                className="text-decoration-none small"
                style={{ color: "#667eea" }}
              >
                ← Back
              </Link>
              <h4 className="fw-bold mt-2 mb-1" style={{ color: "#667eea" }}>
                {course?.title}
              </h4>
              <div className="text-secondary small mb-3">{course?.description}</div>

              <div className="list-group">
                {sections.map((s) => {
                  const active = s._id === selectedSectionId;
                  return (
                    <button
                      key={s._id}
                      className={`list-group-item list-group-item-action ${active ? "active" : ""}`}
                      onClick={() => setSearchParams({ section: s._id })}
                      style={active ? { backgroundColor: "#667eea", borderColor: "#667eea" } : {}}
                    >
                      {s.title}
                    </button>
                  );
                })}
                {sections.length === 0 ? (
                  <div className="text-secondary small">No sections yet.</div>
                ) : null}
              </div>
            </div>
          </aside>

          <main className="col-12 col-lg-9" style={{ paddingLeft: 20 }}>
            <h2 className="page-title">{selectedSection?.title || "Select a section"}</h2>

            {loadingSessions ? <Loading label="Loading sessions..." /> : null}

            <div className="session-grid">
              {sessions.map((sess) => (
                <Link key={sess._id} className="session-button" to={`/learn/${sess._id}`}>
                  {sess.title}
                </Link>
              ))}
              {!loadingSessions && sessions.length === 0 ? (
                <div className="alert alert-info mb-0">No sessions in this section yet.</div>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

