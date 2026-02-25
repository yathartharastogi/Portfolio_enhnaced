import WindowWrapper from "#hoc/WindowWrapper.jsx";
import WindowControls from "#components/WindowControls.jsx";
import { useEffect, useRef, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

const Resume = () => {
  const contentRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(720);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width ?? 0;
      if (!width) return;
      setPageWidth(Math.max(320, Math.floor(width - 32)));
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div id="window-header" className="relative">
        <WindowControls target="resume" />
        <h2 className="absolute left-1/2 -translate-x-1/2 pointer-events-none">Resume.pdf</h2>

        <a href="files/resume.pdf" download className="cursor-pointer ml-auto" title="Download resume">
          <DownloadIcon className="icon" />
        </a>
      </div>
      <div ref={contentRef} className="resume-content">
        <Document file="files/resume.pdf">
          <Page pageNumber={1} width={pageWidth} renderAnnotationLayer renderTextLayer />
        </Document>
      </div>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
