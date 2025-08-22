import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// --- THIS IS THE FIX: The 'export' keyword is correctly placed ---
export interface PageRotation {
  [pageIndex: number]: number;
}

interface PageRotatorProps {
  pdfDoc: PDFDocumentProxy | null;
  onRotationsChange: (rotations: PageRotation) => void;
}

const PageCanvas = ({ page }: { page: PDFPageProxy }) => {
    const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            const viewport = page.getViewport({ scale: 0.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            if(context) {
                page.render({ canvasContext: context, viewport: viewport });
            }
        }
    }, [page]);
    return <canvas ref={canvasRef} className="rounded-md border shadow-sm" />;
};

export const PageRotator = ({ pdfDoc, onRotationsChange }: PageRotatorProps) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [rotations, setRotations] = useState<PageRotation>({});

  useEffect(() => {
    if (pdfDoc) {
      const allPages: PDFPageProxy[] = [];
      const promises = Array.from({ length: pdfDoc.numPages }, (_, i) => pdfDoc.getPage(i + 1));
      Promise.all(promises).then(setPages);
      setRotations({});
    }
  }, [pdfDoc]);

  const handleRotate = (pageIndex: number) => {
    const newRotations = { ...rotations };
    const currentRotation = newRotations[pageIndex] || 0;
    newRotations[pageIndex] = (currentRotation + 90) % 360;
    setRotations(newRotations);
    onRotationsChange(newRotations);
  };

  if (!pdfDoc) return null;

  return (
    <div className="w-full">
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg mb-6">
            <p>Mouse over a page preview and click the <RotateCw className="inline-block h-4 w-4 mx-1" /> icon to rotate that specific page.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((page, index) => (
                <div key={`page-${index}`} className="relative group border rounded-lg p-2 bg-white">
                    <PageCanvas page={page} />
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        style={{ transform: `rotate(${rotations[index] || 0}deg)` }}
                    >
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="rounded-full h-12 w-12"
                            onClick={() => handleRotate(index)}
                        >
                            <RotateCw className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded">
                        {index + 1}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
