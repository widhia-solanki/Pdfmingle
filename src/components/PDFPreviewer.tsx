// src/components/PDFPreviewer.tsx

import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFPreviewerProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  rotationAngle?: number;
}

const PDFPreviewer: React.FC<PDFPreviewerProps> = ({
  file,
  index,
  onRemove,
  rotationAngle = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const page = await pdf.getPage(1);
        
        // Use a consistent scale for previews
        const scale = 0.4;
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error("Failed to render PDF preview:", error);
        // Optional: Draw an error message on the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#FF0000';
        context.font = '16px sans-serif';
        context.fillText('Error loading preview', 10, 20);
      }
    };
    renderPdf();
  }, [file]);

  return (
    // THE FIX: Use semantic theme variables for background, border, etc.
    <div className="relative group border border-border rounded-lg p-2 shadow-sm bg-card flex flex-col items-center">
      <div
        className="transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        <canvas ref={canvasRef} className="rounded-md border border-border" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground truncate w-full text-center">
        {file.name}
      </p>

      <Button
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PDFPreviewer;
