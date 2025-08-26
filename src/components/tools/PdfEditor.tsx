// src/components/tools/PdfEditor.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { EditableObject, TextObject, ImageObject } from '@/lib/pdf/edit';
import { cn } from '@/lib/utils';
import { EditMode } from './EditorToolbar';
import { Rnd } from 'react-rnd';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfEditorProps {
  file: File;
  pageIndex: number;
  objects: EditableObject[];
  onObjectsChange: (objects: EditableObject[]) => void;
  mode: EditMode;
  onObjectSelect: (object: EditableObject | null) => void;
}

export const PdfEditor = ({ file, pageIndex, objects, onObjectsChange, mode, onObjectSelect }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      type: 'text',
      id: `text-${Date.now()}`,
      x, y,
      text: "Double-click to edit",
      size: 24,
      font: 'Helvetica',
      color: { r: 0, g: 0, b: 0 },
      pageIndex,
      width: 200, height: 50,
    };
    onObjectsChange([...objects, newText]);
    onObjectSelect(newText);
  };
  
  // --- THIS IS THE DEFINITIVE FIX ---
  // We explicitly check the type of the object before updating it.
  // This removes all ambiguity for TypeScript.
  const updateObject = (id: string, newProps: Partial<EditableObject>) => {
    const updatedObjects = objects.map(obj => {
      if (obj.id === id) {
        // Create a new object with the updated properties
        const updatedObj = { ...obj, ...newProps };
        // Ensure the 'type' property is correct based on the original object
        if (obj.type === 'text' && updatedObj.type === 'text') {
          return updatedObj as TextObject;
        }
        if (obj.type === 'image' && updatedObj.type === 'image') {
          return updatedObj as ImageObject;
        }
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };
  
  if (error) {
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
        className={cn("border rounded-md", mode === 'text' && "cursor-text", isLoading && "opacity-0")}
        onClick={handleCanvasClick}
      />
      
      {!isLoading &&
        objects
          .filter(obj => obj.pageIndex === pageIndex)
          .map((obj) => (
            <Rnd
              key={obj.id}
              bounds="parent"
              size={{ width: obj.width, height: obj.height }}
              position={{ x: obj.x, y: obj.y }}
              onDragStart={() => onObjectSelect(obj)}
              onDragStop={(e, d) => updateObject(obj.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                 updateObject(obj.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                });
              }}
              className="border-2 border-transparent hover:border-blue-500 hover:border-dashed"
            >
              {obj.type === 'text' ? (
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
              ) : (
                <img 
                  src={URL.createObjectURL(new Blob([obj.imageBytes]))} 
                  alt="user upload" 
                  className="w-full h-full object-contain"
                />
              )}
            </Rnd>
          ))
      }
    </div>
  );
};
