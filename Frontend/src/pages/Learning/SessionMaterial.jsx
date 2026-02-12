import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import PdfArticleViewer from "../../components/PdfArticleViewer";
import { api } from "../../services/api";
import { deleteSessionContent } from "../../services/lmsService";
import { useAuth } from "../../state/AuthContext";

export default function SessionMaterialPage() {
  const { sessionId, materialIndex } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);

  async function handleDelete(material, index) {
    if (!window.confirm("Delete this material?")) return;
    try {
      const contentId = material._id || material.publicId || index;
      await deleteSessionContent(sessionId, "materials", contentId);

      const newMaterials = (session.materials || []).filter((_, i) => i !== index);
      if (newMaterials.length === 0) {
        setSession({ ...session, materials: [] });
        // If no materials left, maybe redirect or just show empty state
      } else {
        setSession({ ...session, materials: newMaterials });
        if (index === currentMaterialIndex) {
          setCurrentMaterialIndex(0);
        } else if (index < currentMaterialIndex) {
          setCurrentMaterialIndex(currentMaterialIndex - 1);
        }
      }
    } catch (err) {
      alert("Failed to delete material");
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/sessions/${sessionId}`);
        if (!mounted) return;
        setSession(data);

        // Debug: Log what we received
        console.log("[SessionMaterial] Session data received:", {
          sessionId: data._id,
          title: data.title,
          materialsArray: data.materials,
          materialsCount: data.materials?.length || 0,
          legacyMaterialUrl: data.studyMaterialUrl,
          firstMaterialUrl: data.materials?.[0]?.materialUrl,
        });

        // Set current material index from URL param or default to 0
        const index = materialIndex ? parseInt(materialIndex, 10) : 0;
        setCurrentMaterialIndex(isNaN(index) ? 0 : index);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load material");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sessionId, materialIndex]);

  // Get materials array (support both new array format and legacy single URL)
  const materials = session?.materials && session.materials.length > 0
    ? session.materials.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.studyMaterialUrl
      ? [{ materialUrl: session.studyMaterialUrl, title: session.title || "Study Material", order: 0 }]
      : [];

  const currentMaterial = materials[currentMaterialIndex];
  const pdfUrl = currentMaterial?.materialUrl || "";

  function handleNextMaterial() {
    if (currentMaterialIndex < materials.length - 1) {
      const nextIndex = currentMaterialIndex + 1;
      setCurrentMaterialIndex(nextIndex);
    }
  }

  function handlePrevMaterial() {
    if (currentMaterialIndex > 0) {
      const prevIndex = currentMaterialIndex - 1;
      setCurrentMaterialIndex(prevIndex);
    }
  }

  if (loading) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <Loading label="Loading PDF..." />
        </div>
      </div>
    );
  }

  if (error || materials.length === 0) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <div className="alert alert-warning">
            {error || "No study materials available for this session"}
          </div>
          <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
            Back
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
  breadcrumbItems.push({ label: session?.title || "Session", path: `/learn/${sessionId}` });
  breadcrumbItems.push({ label: `Material ${currentMaterialIndex + 1} of ${materials.length}`, path: "" });

  return (
    <div className="container app-shell">
      <Breadcrumb items={breadcrumbItems} />

      <div className="content-area">
        <h2 className="page-title mb-3">{session?.title}</h2>

        {/* Tabs Navigation - Matching Second Image */}
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link d-flex align-items-center gap-2"
              to={`/learn/${sessionId}/video`}
            >
              <span>🎥</span>
              <span>Videos</span>
              {session?.videos?.length > 0 && (
                <span className="badge bg-secondary rounded-pill">{session.videos.length}</span>
              )}
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link d-flex align-items-center gap-2"
              to={`/learn/${sessionId}/ppt/0`}
            >
              <span>📊</span>
              <span>PPTs</span>
              {session?.ppts?.length > 0 && (
                <span className="badge bg-secondary rounded-pill">{session.ppts.length}</span>
              )}
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link active d-flex align-items-center gap-2`}
              type="button"
            >
              <span>📄</span>
              <span>Study Materials</span>
              {materials.length > 0 && (
                <span className="badge bg-secondary rounded-pill">{materials.length}</span>
              )}
            </button>
          </li>
        </ul>

        {/* Materials List - Card Layout */}
        {/* <div className="row g-3 mb-4">
          {materials.map((material, idx) => (
            <div key={idx} className="col-12">
              <div className={`card ${idx === currentMaterialIndex ? "border-primary" : ""}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="card-title mb-1">
                        {material.title || `Material ${idx + 1}`}
                      </h5>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className={`btn ${idx === currentMaterialIndex ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setCurrentMaterialIndex(idx)}
                      >
                        {idx === currentMaterialIndex ? "▶ Viewing" : `View PDF ${idx + 1}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* PDF Viewer Section */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h4 className="mb-0">
            Material {currentMaterialIndex + 1} of {materials.length}
          </h4>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
              Back
            </Link>
            {pdfUrl && (
              <a className="btn btn-outline-secondary" href={pdfUrl} target="_blank" rel="noreferrer">
                Open PDF in new tab
              </a>
            )}
            {isAdmin && (
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                onClick={() => handleDelete(currentMaterial, currentMaterialIndex)}
              >
                <FaTrash size={14} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Material Navigation */}
        {materials.length > 1 && (
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrevMaterial}
              disabled={currentMaterialIndex === 0}
            >
              ← Previous Material
            </button>
            <span className="text-muted">
              Material {currentMaterialIndex + 1} of {materials.length}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextMaterial}
              disabled={currentMaterialIndex === materials.length - 1}
            >
              Next Material →
            </button>
          </div>
        )}

        {/* Material List Sidebar (if multiple materials) */}
        {materials.length > 1 && (
          <div className="mb-3">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">All Materials ({materials.length})</h6>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {materials.map((material, idx) => (
                  <div key={idx} className="d-flex align-items-center w-100">
                    <button
                      type="button"
                      className={`list-group-item list-group-item-action ${idx === currentMaterialIndex ? "active" : ""
                        }`}
                      onClick={() => setCurrentMaterialIndex(idx)}
                      style={{ cursor: "pointer" }}
                    >
                      {material.title || `Material ${idx + 1}`}
                    </button>
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        style={{ zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(material, idx);
                        }}
                        title="Delete Material"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Article Viewer - Renders PDF as article-style content */}
        <div className="mt-3">
          {pdfUrl ? (
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "1rem",
                minHeight: "400px",
                overflowY: "auto",
                maxHeight: "80vh",
              }}
            >
              <PdfArticleViewer pdfUrl={pdfUrl} />
            </div>
          ) : (
            <div className="alert alert-info mb-0">No PDF URL available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

