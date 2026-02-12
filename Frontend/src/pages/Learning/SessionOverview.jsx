import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../services/api";

export default function SessionOverviewPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/sessions/${sessionId}`);
        if (!mounted) return;
        setSession(data);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load session");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <Loading label="Loading session..." />
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

  const breadcrumbItems = [{ label: "Academy", path: "/courses" }];
  if (session?.sectionId?.courseId) {
    const course = session.sectionId.courseId;
    breadcrumbItems.push({ label: course.title, path: `/courses/${course._id}` });
  }
  breadcrumbItems.push({ label: session?.title || "Session", path: "" });

  return (
    <div className="container app-shell">
      <Breadcrumb items={breadcrumbItems} />

      <div className="content-area">
        <h2 className="page-title">{session?.sectionId?.courseId?.title} - {session?.title}</h2>

        <div className="file-grid">
          <div className="file-card">
            <div className="file-icon">📄</div>
            <h3>Session Study Material</h3>
            <p>Download or view the study material for this session</p>
            <Link className="file-button" to={`/learn/${sessionId}/material`}>
              Open Material
            </Link>
          </div>

          <div className="file-card">
            <div className="file-icon">📊</div>
            <h3>Classroom PPT</h3>
            <p>Access the PowerPoint presentation used in class</p>
            <Link className="file-button" to={`/learn/${sessionId}/ppt`}>
              Open PPT
            </Link>
          </div>

          <div className="file-card">
            <div className="file-icon">🎥</div>
            <h3>YouTube / Video Link</h3>
            <p>Watch the video lecture for this session</p>
            <Link className="file-button" to={`/learn/${sessionId}/video`}>
              Watch Video
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

