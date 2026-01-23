import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../services/api";

function isHttpUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

export default function SessionPptPage() {
  const { sessionId, pptIndex } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPptIndex, setCurrentPptIndex] = useState(0);

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

  // Best "slide viewer" with minimal code: Office online embed (requires a public http(s) URL)
  const officeEmbedUrl = useMemo(() => {
    if (!pptUrl || !isHttpUrl(pptUrl)) return "";
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
  breadcrumbItems.push({ label: `PPT ${currentPptIndex + 1} of ${ppts.length}`, path: "" });

  return (
    <div className="container app-shell">
      <Breadcrumb items={breadcrumbItems} />

      <div className="content-area">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="page-title mb-0">
            {currentPpt?.title || `PPT ${currentPptIndex + 1}`} ({currentPptIndex + 1} of {ppts.length})
          </h2>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
              Back
            </Link>
            {pptUrl && (
              <a className="btn btn-primary" href={pptUrl} target="_blank" rel="noreferrer">
                Download / Open
              </a>
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
              ← Previous PPT
            </button>
            <span className="text-muted">
              PPT {currentPptIndex + 1} of {ppts.length}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextPpt}
              disabled={currentPptIndex === ppts.length - 1}
            >
              Next PPT →
            </button>
          </div>
        )}

        {/* PPT List Sidebar (if multiple PPTs) */}
        {ppts.length > 1 && (
          <div className="mb-3">
            <div className="card">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">All PPTs ({ppts.length})</h6>
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {ppts.map((ppt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                      idx === currentPptIndex ? "active" : ""
                    }`}
                    onClick={() => {
                      setCurrentPptIndex(idx);
                      navigate(`/learn/${sessionId}/ppt/${idx}`, { replace: true });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {ppt.title || `PPT ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PPT Viewer */}
        <div className="mt-3">
          {!pptUrl ? (
            <div className="alert alert-info mb-0">No PPT URL available.</div>
          ) : officeEmbedUrl ? (
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
              PPT slide viewer needs a <strong>public http(s) URL</strong> (Cloudinary/hosting). 
              Right now your PPT URL doesn't look public, so please use the "Download / Open" button.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
