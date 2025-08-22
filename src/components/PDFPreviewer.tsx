import { useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PDFPreviewerProps {
  pdfDoc: PDFDocumentProxy | null;
}

export const PDFPreviewer = ({ pdfDoc }: PDFPreviewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        if (context) {
          page.render({ canvasContext: context, viewport: viewport });
        }
      } catch (error) {
        console.error("Error rendering PDF preview:", error);
      }
    };
    renderPdf();
  }, [pdfDoc]);

  if (!pdfDoc) {
    return (
      <div className="border rounded-lg p-2 bg-gray-100 flex items-center justify-center h-96">
        <p className="text-gray-500">Loading Preview...</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-2 bg-gray-100 overflow-hidden">
      <canvas ref={canvasRef} style={{ maxWidth: '100%', display: 'block' }} />
    </div>
  );
};
