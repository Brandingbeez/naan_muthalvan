import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set worker path for PDF.js
// Use local worker file from public folder to avoid CORS issues
// Vite serves files from public folder at root path
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
} else {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export default function PdfArticleViewer({ pdfUrl }) {
  const [pdfContent, setPdfContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (!pdfUrl) {
      setError("No PDF URL provided");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadPdf() {
      try {
        setLoading(true);
        setError("");

        // Load PDF document with CORS support
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false,
          httpHeaders: {},
          verbosity: 0, // Suppress console warnings
        });

        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        // Extract text from all pages
        const pagesContent = [];
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Combine all text items into a single string
          const pageText = textContent.items
            .map((item) => item.str)
            .join(" ");

          // Try to extract structured content (headings, paragraphs)
          const structuredContent = extractStructuredContent(textContent.items);

          pagesContent.push({
            pageNum,
            text: pageText,
            structured: structuredContent,
          });
        }

        if (mounted) {
          setPdfContent(pagesContent);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (mounted) {
          let errorMessage = `Failed to load PDF: ${err.message}`;
          
          // Provide helpful error messages
          if (err.message.includes("worker") || err.message.includes("Failed to fetch")) {
            errorMessage = "PDF worker failed to load. Please check your internet connection or try refreshing the page.";
          } else if (err.message.includes("CORS")) {
            errorMessage = "CORS error: PDF file may not be accessible. Please check GCS bucket CORS configuration.";
          }
          
          setError(errorMessage);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      mounted = false;
    };
  }, [pdfUrl]);

  // Extract structured content (headings, paragraphs) from PDF text items
  function extractStructuredContent(items) {
    if (!items || items.length === 0) return [];

    const structured = [];
    let currentParagraph = [];
    const fontSizes = items.map((item) => item.transform?.[0] || 12).filter(Boolean);
    const avgFontSize = fontSizes.length > 0 
      ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length 
      : 12;

    items.forEach((item, index) => {
      if (!item.str || item.str.trim().length === 0) {
        // Empty item, might be a line break
        if (currentParagraph.length > 0) {
          currentParagraph.push({ str: " " });
        }
        return;
      }

      const fontSize = item.transform?.[0] || avgFontSize;
      const text = item.str.trim();
      const isLargeFont = fontSize > avgFontSize + 2;
      const isShortText = text.length < 80;
      const isAllCaps = text === text.toUpperCase() && text.length > 3;
      const startsWithNumber = /^\d+[\.\)]\s/.test(text);
      const isHeading = isLargeFont || (isShortText && (isAllCaps || startsWithNumber || /^[A-Z]/.test(text)));

      if (isHeading && currentParagraph.length > 0) {
        // Save previous paragraph before heading
        const paraText = currentParagraph
          .map((i) => i.str)
          .join(" ")
          .trim();
        if (paraText.length > 0) {
          structured.push({
            type: "paragraph",
            content: paraText,
          });
        }
        currentParagraph = [];
      }

      if (isHeading) {
        // This is a heading
        structured.push({
          type: "heading",
          content: text,
          level: fontSize > avgFontSize + 4 ? 1 : fontSize > avgFontSize + 2 ? 2 : 3,
        });
      } else {
        currentParagraph.push(item);
      }
    });

    // Add remaining paragraph
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph
        .map((i) => i.str)
        .join(" ")
        .trim();
      if (paraText.length > 0) {
        structured.push({
          type: "paragraph",
          content: paraText,
        });
      }
    }

    return structured;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading PDF...</span>
        </div>
        <p className="mt-3 text-muted">Loading PDF content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <strong>Error:</strong> {error}
        <div className="mt-2">
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
            Try opening PDF in new tab
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pdf-article-viewer">
      <style>{`
        .pdf-article-viewer {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          background: white;
          line-height: 1.8;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }

        .pdf-article-viewer h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 2rem 0 1.5rem;
          color: #1a1a1a;
          line-height: 1.2;
          border-bottom: 3px solid #667eea;
          padding-bottom: 1rem;
        }

        .pdf-article-viewer h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 2.5rem 0 1rem;
          color: #2c3e50;
          line-height: 1.3;
        }

        .pdf-article-viewer h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 0.75rem;
          color: #34495e;
          line-height: 1.4;
        }

        .pdf-article-viewer p {
          font-size: 1.1rem;
          margin: 1.25rem 0;
          color: #444;
          text-align: justify;
        }

        .pdf-article-viewer .page-separator {
          border-top: 2px dashed #ddd;
          margin: 3rem 0;
          padding-top: 2rem;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .pdf-article-viewer {
            padding: 1.5rem 1rem;
          }

          .pdf-article-viewer h1 {
            font-size: 2rem;
          }

          .pdf-article-viewer h2 {
            font-size: 1.75rem;
          }

          .pdf-article-viewer h3 {
            font-size: 1.25rem;
          }

          .pdf-article-viewer p {
            font-size: 1rem;
            text-align: left;
          }
        }
      `}</style>

      {pdfContent.map((page, pageIndex) => (
        <div key={pageIndex} className="pdf-page-content">
          {page.structured && page.structured.length > 0 ? (
            // Render structured content (headings + paragraphs)
            page.structured.map((item, idx) => {
              if (item.type === "heading") {
                const HeadingTag = `h${item.level}`;
                return (
                  <HeadingTag key={idx} className={`heading-level-${item.level}`}>
                    {item.content}
                  </HeadingTag>
                );
              } else {
                return (
                  <p key={idx} className="paragraph">
                    {item.content}
                  </p>
                );
              }
            })
          ) : (
            // Fallback: render as plain text
            <p className="paragraph">{page.text}</p>
          )}

          {pageIndex < pdfContent.length - 1 && (
            <div className="page-separator">Page {page.pageNum}</div>
          )}
        </div>
      ))}
    </div>
  );
}
