// src/components/tools/PdfEditor.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { TextObject } from '@/lib/pdf/edit';
import { cn } from '@/lib/utils';
import { EditMode } from './EditorToolbar';
import { Rnd } from 'react-rnd'; // We'll need to install this library

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfEditorProps {
  file: File;
  pageIndex: number;
  textObjects: TextObject[];
  onTextObjectsChange: (objects: TextObject[]) => void;
  mode: EditMode;
  onObjectSelect: (object: TextObject | null) => void;
}

export const PdfEditor = ({ file, pageIndex, textObjects, onTextObjectsChange, mode, onObjectSelect }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to render the base PDF page
  useEffect(() => {
    // ... (This effect remains unchanged from the previous version)
    const renderPage = async () => {
      if (!canvasRef.current || !file) return;
      setIsLoading(true);
      setError(null);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
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
      text: "Double-click to edit",
      size: 24,
      font: 'Helvetica',
      color: { r: 0, g: 0, b: 0 },
      pageIndex,
      width: 200, // Give a default width
    };
    onTextObjectsChange([...textObjects, newText]);
    onObjectSelect(newText); // Select the new object immediately
  };
  
  // This updates the position of a text object after dragging
  const updateTextObject = (id: string, newProps: Partial<TextObject>) => {
    const updatedObjects = textObjects.map(obj =>
      obj.id === id ? { ...obj, ...newProps } : obj
    );
    onTextObjectsChange(updatedObjects);
  };
  
  if (error) { //... (Error handling remains unchanged)
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-fit h-fit shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "border rounded-md", 
          mode === 'text' && "cursor-text",
          isLoading && "opacity-0"
        )}
        onClick={handleCanvasClick}
      />
      
      {/* This is where the interactive text objects are rendered */}
      {!isLoading &&
        textObjects
          .filter(obj => obj.pageIndex === pageIndex)
          .map((obj, index) => (
            <Rnd
              key={obj.id}
              bounds="parent"
              size={{ width: obj.width || 200, height: 'auto' }}
              position={{ x: obj.x, y: obj.y }}
              onDragStart={() => onObjectSelect(obj)}
              onDragStop={(e, d) => {
                updateTextObject(obj.id, { x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                 updateTextObject(obj.id, {
                  width: parseInt(ref.style.width),
                  ...position,
                });
              }}
              className="border-2 border-transparent hover:border-blue-500 hover:border-dashed"
            >
                <div
                    style={{
                      fontSize: `${obj.size}px`,
                      color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`,
                      fontFamily: obj.font,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.2,
                    }}
                >
                 {obj.text}
                </div>
            </Rnd>
          ))
      }
    </div>
  );
};
