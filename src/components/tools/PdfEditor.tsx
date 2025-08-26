// src/components/tools/PdfEditor.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { TextObject } from '@/lib/pdf/edit';
import { cn } from '@/lib/utils';
import { EditMode } from './EditorToolbar';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfEditorProps {
  file: File;
  pageIndex: number; // The 0-based index of the page to display
  textObjects: TextObject[];
  onTextObjectsChange: (objects: TextObject[]) => void;
  mode: EditMode;
}

export const PdfEditor = ({ file, pageIndex, textObjects, onTextObjectsChange, mode }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect is responsible for rendering the PDF page
  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current || !file) return;
      setIsLoading(true);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const fileBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      
      // pdfjs is 1-based, so we add 1 to our 0-based index
      const page = await pdf.getPage(pageIndex + 1); 
      const viewport = page.getViewport({ scale: 1.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      setIsLoading(false);
    };

    renderPage();
  }, [file, pageIndex]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'text' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newText: TextObject = {
      id: `text-${Date.now()}`,
      x,
      y,
      text: "New Text",
      size: 24,
      font: 'Helvetica',
      color: { r: 0, g: 0, b: 0 },
      pageIndex,
    };

    onTextObjectsChange([...textObjects, newText]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className={cn("border rounded-md shadow-lg", mode === 'text' && "cursor-text")}
        onClick={handleCanvasClick}
      />
      {/* This will render the text objects on top of the canvas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {textObjects
          .filter(obj => obj.pageIndex === pageIndex)
          .map(obj => (
            <div
              key={obj.id}
              style={{
                position: 'absolute',
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                fontSize: `${obj.size * 1.5}px`, // Adjust for canvas scale
                color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`,
                fontFamily: obj.font,
                transform: 'translateY(-100%)', // Align text baseline correctly
              }}
            >
              {obj.text}
            </div>
          ))}
      </div>
    </div>
  );
};
