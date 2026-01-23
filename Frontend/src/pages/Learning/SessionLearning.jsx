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
        {session?.description && (
          <p className="text-muted mb-4">{session.description}</p>
        )}

        {/* Tabs Navigation */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
              type="button"
            >
              🎥 Videos {videos.length > 0 && <span className="badge bg-secondary">{videos.length}</span>}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "ppts" ? "active" : ""}`}
              onClick={() => setActiveTab("ppts")}
              type="button"
            >
              📊 PPTs {ppts.length > 0 && <span className="badge bg-secondary">{ppts.length}</span>}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "materials" ? "active" : ""}`}
              onClick={() => setActiveTab("materials")}
              type="button"
            >
              📄 Study Materials {materials.length > 0 && <span className="badge bg-secondary">{materials.length}</span>}
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div>
              {videos.length > 0 ? (
                <div className="row g-3">
                  {videos.map((video, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{video.title || `Video ${idx + 1}`}</h5>
                          {video.duration && (
                            <p className="text-muted small mb-2">Duration: {video.duration}</p>
                          )}
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate(`/learn/${sessionId}/video`)}
                          >
                            Watch Video {idx + 1}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">No videos available for this session.</div>
              )}
            </div>
          )}

          {/* PPTs Tab */}
          {activeTab === "ppts" && (
            <div>
              {ppts.length > 0 ? (
                <div className="row g-3">
                  {ppts.map((ppt, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{ppt.title || `PPT ${idx + 1}`}</h5>
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate(`/learn/${sessionId}/ppt/${idx}`)}
                          >
                            Open PPT {idx + 1}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">No PPTs available for this session.</div>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div>
              {materials.length > 0 ? (
                <div className="row g-3">
                  {materials.map((material, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{material.title || `Material ${idx + 1}`}</h5>
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => navigate(`/learn/${sessionId}/material/${idx}`)}
                          >
                            View PDF {idx + 1}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info">No study materials available for this session.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
