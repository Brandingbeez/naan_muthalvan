import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../services/api";

export default function SessionLearningPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("videos"); // 'videos', 'ppts', 'materials'

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/sessions/${sessionId}`);
        if (!mounted) return;
        setSession(data);
        
        // Set default tab based on available content
        if (data.videos && data.videos.length > 0) {
          setActiveTab("videos");
        } else if (data.ppts && data.ppts.length > 0) {
          setActiveTab("ppts");
        } else if (data.materials && data.materials.length > 0) {
          setActiveTab("materials");
        }
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
      <div className="container py-4">
        <Loading label="Loading session..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-outline-primary">
          Back to courses
        </Link>
      </div>
    );
  }

  // Get content arrays (support both new array format and legacy single URL)
  const videos = session?.videos && session.videos.length > 0
    ? session.videos.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.videoUrl
    ? [{ videoUrl: session.videoUrl, title: session.title || "Video", order: 0 }]
    : [];

  const ppts = session?.ppts && session.ppts.length > 0
    ? session.ppts.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.pptUrl
    ? [{ pptUrl: session.pptUrl, title: session.title || "PPT", order: 0 }]
    : [];

  const materials = session?.materials && session.materials.length > 0
    ? session.materials.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.studyMaterialUrl
    ? [{ materialUrl: session.studyMaterialUrl, title: session.title || "Study Material", order: 0 }]
    : [];

  // Build breadcrumb from session data
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
        <h2 className="page-title">{session?.title}</h2>
        
        {/* Three Cards Layout - Matching First Image */}
        <div className="file-grid">
          {/* Session Study Material Card */}
          <div className="file-card">
            <div className="file-icon">📄</div>
            <h3>Session Study Material</h3>
            <p>Download or view the study material for this session</p>
            <button
              className="file-button"
              onClick={() => {
                if (materials.length > 0) {
                  navigate(`/learn/${sessionId}/material/0`);
                } else {
                  alert("No study materials available for this session.");
                }
              }}
              disabled={materials.length === 0}
            >
              Open Material
            </button>
          </div>

          {/* Classroom PPT Card */}
          <div className="file-card">
            <div className="file-icon">📊</div>
            <h3>Classroom PPT</h3>
            <p>Access the PowerPoint presentation used in class</p>
            <button
              className="file-button"
              onClick={() => {
                if (ppts.length > 0) {
                  navigate(`/learn/${sessionId}/ppt/0`);
                } else {
                  alert("No PPTs available for this session.");
                }
              }}
              disabled={ppts.length === 0}
            >
              Open PPT
            </button>
          </div>

          {/* YouTube Link / Videos Card */}
          <div className="file-card">
            <div className="file-icon">🎥</div>
            <h3>YouTube Link</h3>
            <p>Watch the video lecture for this session</p>
            <button
              className="file-button"
              onClick={() => {
                if (videos.length > 0) {
                  navigate(`/learn/${sessionId}/video`);
                } else {
                  alert("No videos available for this session.");
                }
              }}
              disabled={videos.length === 0}
            >
              Watch Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
