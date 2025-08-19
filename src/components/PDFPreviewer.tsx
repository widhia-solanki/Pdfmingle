// src/components/PDFPreviewer.tsx

import { useEffect, useRef } from 'react';
// --- THIS IS THE FIX: Import the types directly ---
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PDFPreviewerProps {
  file: File;
}

export const PDFPreviewer = ({ file }: PDFPreviewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      // Use a more specific, direct import path for the library itself
      const pdfJS = await import('pdfjs-dist');
      // The workerSrc is crucial for the library to work in the browser
      pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          
          // Use the imported type here
          const pdf: PDFDocumentProxy = await pdfJS.getDocument(typedArray).promise;
          const page = await pdf.getPage(1); // Preview first page
          const viewport = page.getViewport({ scale: 1.5 }); // Slightly increase scale for better clarity
          
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            if (context) {
              const renderContext = { canvasContext: context, viewport: viewport };
              page.render(renderContext);
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
    };

    if (file && canvasRef.current) {
      renderPdf();
    }
  }, [file]);

  return (
    <div className="border rounded-lg p-2 bg-gray-100 overflow-hidden">
      <canvas ref={canvasRef} style={{ maxWidth: '100%', display: 'block' }} />
    </div>
  );
};
