import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import PdfArticleViewer from "../../components/PdfArticleViewer";
import { api } from "../../services/api";
import { deleteSessionContent } from "../../services/lmsService";
import { useAuth } from "../../state/AuthContext";

function isHttpUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function isPdfFile(url) {
  if (!url) return false;
  // Check if URL ends with .pdf (case insensitive)
  // Also check the file extension in the path
  const lowerUrl = url.toLowerCase();
  return lowerUrl.endsWith('.pdf') || /\.pdf(\?|#|$)/i.test(url);
}

export default function SessionPptPage() {
  const { sessionId, pptIndex } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPptIndex, setCurrentPptIndex] = useState(0);

  async function handleDelete(ppt, index) {
    if (!window.confirm("Delete this PPT?")) return;
    try {
      const contentId = ppt._id || ppt.publicId || index;
      await deleteSessionContent(sessionId, "ppts", contentId);

      const newPpts = (session.ppts || []).filter((_, i) => i !== index);
      if (newPpts.length === 0) {
        setSession({ ...session, ppts: [] });
        navigate(`/learn/${sessionId}`, { replace: true });
      } else {
        setSession({ ...session, ppts: newPpts });
        if (index === currentPptIndex) {
          setCurrentPptIndex(0);
          navigate(`/learn/${sessionId}/ppt/0`, { replace: true });
        } else if (index < currentPptIndex) {
          const newIndex = currentPptIndex - 1;
          setCurrentPptIndex(newIndex);
          navigate(`/learn/${sessionId}/ppt/${newIndex}`, { replace: true });
        }
      }
    } catch (err) {
      alert("Failed to delete PPT");
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

        // Set current PPT index from URL param or default to 0
        const index = pptIndex ? parseInt(pptIndex, 10) : 0;
        setCurrentPptIndex(isNaN(index) ? 0 : index);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load PPT");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sessionId, pptIndex]);

  // Get PPTs array (support both new array format and legacy single URL)
  const ppts = session?.ppts && session.ppts.length > 0
    ? session.ppts.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.pptUrl
      ? [{ pptUrl: session.pptUrl, title: session.title || "PPT", order: 0 }]
      : [];

  const currentPpt = ppts[currentPptIndex];
  const pptUrl = currentPpt?.pptUrl || "";

  // Check if current file is a PDF
  const isCurrentPdf = isPdfFile(pptUrl);

  // Best "slide viewer" with minimal code: Office online embed (requires a public http(s) URL)
  // Only generate Office embed URL for non-PDF files (PPT/PPTX)
  const officeEmbedUrl = useMemo(() => {
    if (!pptUrl || !isHttpUrl(pptUrl) || isPdfFile(pptUrl)) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl)}`;
  }, [pptUrl]);

  function handleNextPpt() {
    if (currentPptIndex < ppts.length - 1) {
      const nextIndex = currentPptIndex + 1;
      setCurrentPptIndex(nextIndex);
      navigate(`/learn/${sessionId}/ppt/${nextIndex}`, { replace: true });
    }
  }

  function handlePrevPpt() {
    if (currentPptIndex > 0) {
      const prevIndex = currentPptIndex - 1;
      setCurrentPptIndex(prevIndex);
      navigate(`/learn/${sessionId}/ppt/${prevIndex}`, { replace: true });
    }
  }

  if (loading) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <Loading label="Loading PPT..." />
        </div>
      </div>
    );
  }

  if (error || ppts.length === 0) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <div className="alert alert-warning">
            {error || "No PPTs available for this session"}
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
  const currentPptUrl = ppts[currentPptIndex]?.pptUrl || "";
  breadcrumbItems.push({
    label: `${isPdfFile(currentPptUrl) ? "PDF" : "PPT"} ${currentPptIndex + 1} of ${ppts.length}`,
    path: ""
  });

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
            <button
              className={`nav-link active d-flex align-items-center gap-2`}
              type="button"
            >
              <span>📊</span>
              <span>PPTs</span>
              {ppts.length > 0 && (
                <span className="badge bg-secondary rounded-pill">{ppts.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className="nav-link d-flex align-items-center gap-2"
              to={`/learn/${sessionId}/material/0`}
            >
              <span>📄</span>
              <span>Study Materials</span>
              {session?.materials?.length > 0 && (
                <span className="badge bg-secondary rounded-pill">{session.materials.length}</span>
              )}
            </Link>
          </li>
        </ul>

        {/* PPTs List - Card Layout */}
        {/* <div className="row g-3 mb-4">
          {ppts.map((ppt, idx) => (
            <div key={idx} className="col-12">
              <div className={`card ${idx === currentPptIndex ? "border-primary" : ""}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="card-title mb-1">
                        {ppt.title || `PPT ${idx + 1}`}
                      </h5>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className={`btn ${idx === currentPptIndex ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => {
                          setCurrentPptIndex(idx);
                          navigate(`/learn/${sessionId}/ppt/${idx}`, { replace: true });
                        }}
                      >
                        {idx === currentPptIndex ? "▶ Viewing" : `Open PPT ${idx + 1}`}
                      </button>
                      {ppt.pptUrl && (
                        <a
                          className="btn btn-outline-secondary"
                          href={ppt.pptUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* PPT Viewer Section */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h4 className="mb-0">
            {isPdfFile(pptUrl) ? "PDF" : "PPT"} {currentPptIndex + 1} of {ppts.length}
          </h4>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
              Back
            </Link>
            {pptUrl && (
              <a className="btn btn-primary" href={pptUrl} target="_blank" rel="noreferrer">
                Download / Open
              </a>
            )}
            {isAdmin && (
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                onClick={() => handleDelete(currentPpt, currentPptIndex)}
              >
                <FaTrash size={14} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* PPT Navigation */}
        {ppts.length > 1 && (
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrevPpt}
              disabled={currentPptIndex === 0}
            >
              ← Previous {isPdfFile(pptUrl) ? "PDF" : "PPT"}
            </button>
            <span className="text-muted">
              {isPdfFile(pptUrl) ? "PDF" : "PPT"} {currentPptIndex + 1} of {ppts.length}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextPpt}
              disabled={currentPptIndex === ppts.length - 1}
            >
              Next {isPdfFile(pptUrl) ? "PDF" : "PPT"} →
            </button>
          </div>
        )}

        {/* PPT List Sidebar (if multiple PPTs) */}
        {ppts.length > 1 && (
          <div className="mb-3">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">All PPTs/PDFs ({ppts.length})</h6>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {ppts.map((ppt, idx) => (
                  <div key={idx} className="d-flex align-items-center w-100">
                    <button
                      type="button"
                      className={`list-group-item list-group-item-action ${idx === currentPptIndex ? "active" : ""
                        }`}
                      onClick={() => {
                        setCurrentPptIndex(idx);
                        navigate(`/learn/${sessionId}/ppt/${idx}`, { replace: true });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {ppt.title || `PPT ${idx + 1}`}
                    </button>
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        style={{ zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ppt, idx);
                        }}
                        title="Delete PPT"
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

        {/* PPT/PDF Viewer */}
        <div className="mt-3">
          {!pptUrl ? (
            <div className="alert alert-info mb-0">No PPT/PDF URL available.</div>
          ) : isCurrentPdf ? (
            // PDF Viewer - render as article-style content
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
              <PdfArticleViewer pdfUrl={pptUrl} />
            </div>
          ) : officeEmbedUrl ? (
            // PPT Viewer - use Office Online viewer
            <iframe
              title="PPT Viewer"
              src={officeEmbedUrl}
              style={{
                width: "100%",
                height: "75vh",
                border: "0",
                borderRadius: "12px",
                background: "#fff",
              }}
              allowFullScreen
            />
          ) : (
            <div className="alert alert-warning mb-0">
              PPT slide viewer needs a <strong>public http(s) URL</strong> (GCS/hosting).
              Right now your PPT URL doesn't look public, so please use the "Download / Open" button.
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
