// src/components/PDFPreviewer.tsx

import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import { Button } from '@/components/ui/button';
import { X, RotateCw } from 'lucide-react';

// FINAL, GUARANTEED FIX: The correct worker URL is 'pdf.worker.min.mjs'
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs`;
}

interface PDFPreviewerProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  onRotate?: (index: number) => void;
  rotationAngle?: number;
}

const PDFPreviewer: React.FC<PDFPreviewerProps> = ({
  file,
  index,
  onRemove,
  onRotate,
  rotationAngle = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        if (!e.target?.result) return;

        const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      };
      fileReader.readAsArrayBuffer(file);
    };

    renderPdf();
  }, [file]);

  return (
    <div className="relative group border rounded-lg p-2 shadow-sm bg-gray-50 flex flex-col items-center">
      <div
        className="transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        <canvas ref={canvasRef} className="rounded-md border" />
      </div>
      <p className="mt-2 text-xs text-gray-600 truncate w-full text-center">
        {file.name}
      </p>

      {/* Remove Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Rotate Button */}
      {onRotate && (
         <Button
            variant="outline"
            size="icon"
            className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
            onClick={() => onRotate(index)}
         >
            <RotateCw className="h-4 w-4" />
         </Button>
      )}
    </div>
  );
};

export default PDFPreviewer;
