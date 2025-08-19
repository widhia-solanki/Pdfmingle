// src/components/PDFPreviewer.tsx
import { useEffect, useRef } from 'react';

interface PDFPreviewerProps {
  file: File;
}

export const PDFPreviewer = ({ file }: PDFPreviewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      const pdfJS = await import('pdfjs-dist/build/pdf');
      pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          const pdf = await pdfJS.getDocument(typedArray).promise;
          const page = await pdf.getPage(1); // Preview first page
          const viewport = page.getViewport({ scale: 1 });
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
    <div className="border rounded-lg p-2 bg-gray-100">
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </div>
  );
};
