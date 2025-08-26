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
  const [error, setError] = useState<string | null>(null); // State to show an error message

  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current || !file) return;
      
      setIsLoading(true);
      setError(null);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        setError("Could not get canvas context.");
        setIsLoading(false);
        return;
      }

      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        
        const page = await pdf.getPage(pageIndex + 1); 
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;

      } catch (err) {
        console.error("Failed to render PDF page:", err);
        setError("Could not load this PDF. The file may be corrupted or password-protected.");
      } finally {
        // This will run whether the render succeeds or fails, guaranteeing the spinner stops.
        setIsLoading(false);
      }
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

  // If there's an error, show a message instead of the editor
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100 p-4 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      )}
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className={cn(
            "border rounded-md shadow-lg", 
            mode === 'text' && "cursor-text",
            isLoading && "opacity-0" // Hide canvas while loading to prevent flicker
          )}
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
                  fontSize: `${obj.size}px`, // No need to scale font size here
                  color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`,
                  fontFamily: obj.font,
                  transform: 'translateY(-100%)', // Align text baseline
                  whiteSpace: 'nowrap',
                }}
              >
                {obj.text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
