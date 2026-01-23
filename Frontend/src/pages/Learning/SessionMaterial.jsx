import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../services/api";

export default function SessionMaterialPage() {
  const { sessionId, materialIndex } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);

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
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="page-title mb-0">
            {currentMaterial?.title || `Study Material ${currentMaterialIndex + 1}`} ({currentMaterialIndex + 1} of {materials.length})
          </h2>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
              Back
            </Link>
            {pdfUrl && (
              <a className="btn btn-primary" href={pdfUrl} target="_blank" rel="noreferrer">
                Open in new tab
              </a>
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
                  <button
                    key={idx}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      idx === currentMaterialIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentMaterialIndex(idx)}
                    style={{ cursor: "pointer" }}
                  >
                    {material.title || `Material ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <div className="mt-3">
          {pdfUrl ? (
            <iframe
              title="PDF Viewer"
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              style={{
                width: "100%",
                height: "75vh",
                border: "0",
                borderRadius: "12px",
                background: "#fff",
              }}
            />
          ) : (
            <div className="alert alert-info mb-0">No PDF URL available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

