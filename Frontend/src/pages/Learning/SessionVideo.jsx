import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import { api } from "../../services/api";

function isYouTube(url) {
  return /youtube\.com|youtu\.be/i.test(url || "");
}

export default function SessionVideoPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playerError, setPlayerError] = useState("");
  const [useNativePlayer, setUseNativePlayer] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [theater, setTheater] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/sessions/${sessionId}`);
        if (!mounted) return;
        setSession(data);
        
        // Debug: Log what we received
        console.log("[SessionVideo] Session data received:", {
          sessionId: data._id,
          title: data.title,
          videosArray: data.videos,
          videosCount: data.videos?.length || 0,
          legacyVideoUrl: data.videoUrl,
          firstVideoUrl: data.videos?.[0]?.videoUrl,
        });
        
        // If session has videos array, use it; otherwise fall back to legacy videoUrl
        const videos = data.videos && data.videos.length > 0 
          ? data.videos 
          : (data.videoUrl ? [{ videoUrl: data.videoUrl, title: data.title || "Video" }] : []);
        
        console.log("[SessionVideo] Processed videos:", videos);
        
        if (videos.length === 0) {
          setError("No videos available for this session");
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || "Failed to load video");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const videos = session?.videos && session.videos.length > 0
    ? session.videos.sort((a, b) => (a.order || 0) - (b.order || 0))
    : session?.videoUrl
    ? [{ videoUrl: session.videoUrl, title: session.title || "Video", order: 0 }]
    : [];

  const currentVideo = videos[currentVideoIndex];

  // Debug: Log current video details and test URL
  useEffect(() => {
    if (currentVideo?.videoUrl) {
      console.log("[SessionVideo] Current video:", {
        title: currentVideo.title,
        videoUrl: currentVideo.videoUrl,
        hasUrl: !!currentVideo.videoUrl,
        urlType: currentVideo.videoUrl?.startsWith("http") ? "HTTP" : "Invalid",
      });
      
      // Test if URL is accessible
      fetch(currentVideo.videoUrl, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            console.log("[SessionVideo] ✅ Video URL is accessible (HTTP", response.status, ")");
          } else {
            console.warn("[SessionVideo] ⚠️ Video URL returned status:", response.status);
            setPlayerError(`Video URL returned HTTP ${response.status}. File may not be publicly accessible.`);
          }
        })
        .catch((err) => {
          console.error("[SessionVideo] ❌ Video URL test failed:", err.message);
          setPlayerError(`Cannot access video URL: ${err.message}. Check CORS configuration on GCS bucket.`);
        });
    }
  }, [currentVideo]);

  function handleVideoEnd() {
    // Auto-play next video if available
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setPlayedSeconds(0);
      setPlayerError(""); // Clear errors when moving to next video
      setUseNativePlayer(false); // Reset to ReactPlayer for next video
    }
  }

  function handleProgress({ playedSeconds: seconds }) {
    setPlayedSeconds(seconds);
  }

  function handleDuration(duration) {
    setVideoDuration(duration);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  async function goFullscreen() {
    const el = playerRef.current?.getInternalPlayer?.() || playerRef.current;
    if (!el) return;
    
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      }
    }
  }

  if (loading) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <Loading label="Loading videos..." />
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="container app-shell">
        <div className="content-area">
          <div className="alert alert-warning">{error || "No videos available for this session"}</div>
          <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
            Back to Session
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
  breadcrumbItems.push({ label: "Videos", path: "" });

  return (
    <div className="container app-shell">
      <Breadcrumb items={breadcrumbItems} />

      <div className="content-area">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h2 className="page-title mb-0">
            {session?.title} - Video {currentVideoIndex + 1} of {videos.length}
          </h2>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to={`/learn/${sessionId}`}>
              Back
            </Link>
            {videos.length > 1 && (
              <button className="btn btn-outline-primary" onClick={() => setTheater((t) => !t)}>
                {theater ? "Hide Playlist" : "Show Playlist"}
              </button>
            )}
            <button className="btn btn-primary" onClick={goFullscreen}>
              Full screen
            </button>
          </div>
        </div>

        <div className="row g-3">
          {/* Main Video Player */}
          <div className={theater ? "col-12" : "col-lg-8"}>
            <div
              ref={playerRef}
              style={{
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              {currentVideo?.videoUrl ? (
                <div>
                  {!useNativePlayer ? (
                    /* Try ReactPlayer first */
                    <ReactPlayer
                      url={currentVideo.videoUrl}
                      width="100%"
                      height="70vh"
                      controls
                      playing={false}
                      onEnded={handleVideoEnd}
                      onProgress={handleProgress}
                      onDuration={handleDuration}
                      onError={(err) => {
                        console.error("[SessionVideo] ReactPlayer error:", err);
                        const errorMsg = err?.message || err?.toString() || "Unknown error";
                        setPlayerError(`ReactPlayer failed: ${errorMsg}. Switching to native player...`);
                        // Switch to native player after 2 seconds
                        setTimeout(() => {
                          setUseNativePlayer(true);
                        }, 2000);
                      }}
                      onReady={() => {
                        console.log("[SessionVideo] ReactPlayer ready");
                        setPlayerError("");
                      }}
                      onStart={() => {
                        console.log("[SessionVideo] Video started");
                        setPlayerError("");
                      }}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                            crossOrigin: "anonymous",
                            preload: "auto",
                          },
                          forceVideo: true,
                          forceHLS: false,
                          forceDASH: false,
                        },
                      }}
                    />
                  ) : (
                    /* Fallback: Native HTML5 video player */
                    <video
                      src={currentVideo.videoUrl}
                      controls
                      width="100%"
                      style={{ 
                        height: "70vh",
                        backgroundColor: "#000",
                        borderRadius: "12px",
                      }}
                      onEnded={handleVideoEnd}
                      onTimeUpdate={(e) => {
                        setPlayedSeconds(e.target.currentTime);
                        setVideoDuration(e.target.duration);
                      }}
                      onLoadedMetadata={(e) => {
                        setVideoDuration(e.target.duration);
                        console.log("[SessionVideo] Native video metadata loaded");
                      }}
                      onError={(e) => {
                        console.error("[SessionVideo] Native video error:", e);
                        const videoEl = e.target;
                        const error = videoEl.error;
                        let errorMsg = "Unknown error";
                        if (error) {
                          switch (error.code) {
                            case error.MEDIA_ERR_ABORTED:
                              errorMsg = "Video playback aborted";
                              break;
                            case error.MEDIA_ERR_NETWORK:
                              errorMsg = "Network error. Check CORS configuration on GCS bucket.";
                              break;
                            case error.MEDIA_ERR_DECODE:
                              errorMsg = "Video decode error";
                              break;
                            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                              errorMsg = "Video format not supported or URL not accessible";
                              break;
                            default:
                              errorMsg = `Error code: ${error.code}`;
                          }
                        }
                        setPlayerError(`Native player failed: ${errorMsg}. Video may not be publicly accessible or CORS not configured.`);
                      }}
                      onLoadedData={() => {
                        console.log("[SessionVideo] Native video data loaded successfully");
                        setPlayerError("");
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {/* Error message and actions */}
                  {playerError && (
                    <div className="alert alert-warning mt-2 small">
                      <strong>⚠️ {playerError}</strong>
                      <div className="mt-2">
                        <strong>Video URL:</strong>
                        <br />
                        <code className="small">{currentVideo.videoUrl}</code>
                      </div>
                      <div className="mt-2">
                        <strong>Quick Fix:</strong>
                        <ol className="mb-0 small">
                          <li>Click "Open video in new tab" below to test if URL works</li>
                          <li>If it works in new tab but not here → CORS issue (configure CORS on GCS bucket)</li>
                          <li>If it doesn't work in new tab → File not publicly accessible (check GCS permissions)</li>
                        </ol>
                      </div>
                    </div>
                  )}
                  
                  {/* Direct video link */}
                  <div className="mt-2 text-center">
                    <a 
                      href={currentVideo.videoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      🔗 Open video in new tab
                    </a>
                    {useNativePlayer && (
                      <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={() => {
                          setUseNativePlayer(false);
                          setPlayerError("");
                        }}
                      >
                        Try ReactPlayer again
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-white p-4 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                  <div className="text-center">
                    <p>No video URL available.</p>
                    <p className="small text-muted">Video URL: {currentVideo?.videoUrl || "Not set"}</p>
                    {currentVideo && (
                      <div className="mt-3">
                        <p className="small">Debug info:</p>
                        <pre className="small text-start" style={{ fontSize: "0.7rem", maxWidth: "500px", margin: "0 auto" }}>
                          {JSON.stringify(currentVideo, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-3">
              <h4>{currentVideo?.title || `Video ${currentVideoIndex + 1}`}</h4>
              <div className="text-muted small">
                {formatTime(playedSeconds)} / {formatTime(videoDuration)}
                {currentVideo?.duration && ` • Duration: ${currentVideo.duration}`}
              </div>
              {playerError && (
                <div className="alert alert-warning mt-2 small">
                  {playerError}
                  <div className="mt-2">
                    <strong>Video URL:</strong> 
                    <a href={currentVideo?.videoUrl} target="_blank" rel="noreferrer" className="ms-2">
                      {currentVideo?.videoUrl}
                    </a>
                  </div>
                  <div className="mt-2 small">
                    <strong>Possible issues:</strong>
                    <ul className="mb-0">
                      <li>Video file might not be publicly accessible</li>
                      <li>CORS might not be configured on GCS bucket</li>
                      <li>Video format might not be supported by browser</li>
                      <li>Try clicking "Open video in new tab" link above</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Playlist Sidebar */}
          {theater && videos.length > 1 && (
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Video Playlist ({videos.length})</h5>
                </div>
                <div className="list-group list-group-flush" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {videos.map((video, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`list-group-item list-group-item-action ${
                        idx === currentVideoIndex ? "active" : ""
                      }`}
                      onClick={() => {
                        setCurrentVideoIndex(idx);
                        setPlayedSeconds(0);
                        setPlayerError(""); // Clear previous errors when switching videos
                        setUseNativePlayer(false); // Reset to ReactPlayer for new video
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          {idx === currentVideoIndex ? (
                            <span className="badge bg-primary">▶</span>
                          ) : (
                            <span className="text-muted">{idx + 1}.</span>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold small">{video.title || `Video ${idx + 1}`}</div>
                          {video.duration && (
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {video.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
