// src/components/tools/PageRotator.tsx

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { PageRotation } from '@/lib/pdf/rotate';

interface PageRotatorProps {
  pdfDoc: PDFDocumentProxy | null;
  onRotationsChange: (rotations: PageRotation) => void;
}

const PageCanvas = ({ page, rotation }: { page: PDFPageProxy, rotation: number }) => {
    const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            const viewport = page.getViewport({ scale: 0.4, rotation });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const context = canvas.getContext('2d');
            if(context) {
                page.render({ canvasContext: context, viewport: viewport });
            }
        }
    }, [page, rotation]);
    return <canvas ref={canvasRef} className="rounded-md border bg-white shadow-sm" />;
};

export const PageRotator = ({ pdfDoc, onRotationsChange }: PageRotatorProps) => {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [rotations, setRotations] = useState<PageRotation>({});

  useEffect(() => {
    if (pdfDoc) {
      const getPages = async () => {
        const allPages: PDFPageProxy[] = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          allPages.push(page);
        }
        setPages(allPages);
      };
      getPages();
      setRotations({}); // Reset rotations for new file
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
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg mb-6 text-sm">
            <p>Click the rotate button on any page to rotate it by 90 degrees clockwise.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pages.map((page, index) => (
                <div key={`page-${index}`} className="relative group p-2">
                    <div className="transition-transform duration-300" style={{ transform: `rotate(${rotations[index] || 0}deg)` }}>
                       <PageCanvas page={page} rotation={0} />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <Button variant="secondary" size="icon" className="rounded-full h-10 w-10" onClick={() => handleRotate(index)}>
                            <RotateCw className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded">
                        {index + 1}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
