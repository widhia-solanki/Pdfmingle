// src/components/tools/PdfEditor.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { EditableObject, TextObject, ImageObject, DrawObject } from '@/lib/pdf/edit';
import { cn } from '@/lib/utils';
import { ToolMode } from './AdvancedEditorToolbar';
import { Rnd } from 'react-rnd';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from '@/lib/pdf/getSvgPathFromStroke';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfEditorProps {
  file: File;
  pageIndex: number;
  objects: EditableObject[];
  onObjectsChange: (objects: EditableObject[]) => void;
  mode: ToolMode;
  onObjectSelect: (object: EditableObject | null) => void;
}

export const RENDER_SCALE = 1.5;

export const PdfEditor = ({ file, pageIndex, objects, onObjectsChange, mode, onObjectSelect }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDrawing, setCurrentDrawing] = useState<DrawObject | null>(null);

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
        const viewport = page.getViewport({ scale: RENDER_SCALE });
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'draw') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    const pressure = e.pressure || 0.5;
    const newDrawing: DrawObject = {
      type: 'drawing', id: `draw-${Date.now()}`, pageIndex,
      points: [{ x: e.clientX - rect.left, y: e.clientY - rect.top, pressure }],
      color: { r: 255, g: 0, b: 0 }, strokeWidth: 8,
    };
    setCurrentDrawing(newDrawing);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== 'draw' || !currentDrawing || e.buttons !== 1) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pressure = e.pressure || 0.5;
      setCurrentDrawing(prev => ({ ...prev!, points: [...prev!.points, { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure }] }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (mode !== 'draw' || !currentDrawing) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (currentDrawing.points.length > 2) {
          onObjectsChange([...objects, currentDrawing]);
      }
      setCurrentDrawing(null);
  };
  
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'text' || !canvasRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newText: TextObject = {
      type: 'text', id: `text-${Date.now()}`, x, y,
      text: "New Text", size: 24, font: 'Helvetica',
      color: { r: 0, g: 0, b: 0 }, pageIndex,
      width: 200, height: 50,
    };
    onObjectsChange([...objects, newText]);
    onObjectSelect(newText);
  };
  
  const updateObject = (id: string, newProps: Partial<TextObject> | Partial<ImageObject>) => {
      const updatedObjects = objects.map(obj =>
        obj.id === id ? { ...obj, ...newProps } : obj
      );
      onObjectsChange(updatedObjects as EditableObject[]);
  };
  
  const handleDoubleClick = (obj: TextObject) => {
    const newObjects = objects.map(o => 
      o.id === obj.id ? { ...o, isEditing: true } : { ...o, isEditing: false }
    );
    onObjectsChange(newObjects as EditableObject[]);
    onObjectSelect(obj);
  };

  const handleTextChange = (id: string, newText: string) => {
    const newObjects = objects.map(o => o.id === id ? { ...o, text: newText } : o);
    onObjectsChange(newObjects as EditableObject[]);
  };
  
  const handleTextBlur = (obj: TextObject) => {
    const newObjects = objects.map(o => o.id === obj.id ? { ...o, isEditing: false } : o);
    onObjectsChange(newObjects as EditableObject[]);
  };

  if (error) { return <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 font-semibold">{error}</p></div>; }

  return (
    <div className="relative w-fit h-fit bg-white shadow-lg">
      {isLoading && (<div className="absolute inset-0 flex items-center justify-center bg-white/50 z-30"><Loader2 className="h-12 w-12 animate-spin text-gray-500" /></div>)}
      
      <canvas ref={canvasRef} className={cn("border rounded-sm", isLoading && "opacity-0")} />
      
      <div
          className={cn("absolute top-0 left-0 w-full h-full z-10", mode === 'draw' || mode === 'text' ? "pointer-events-auto" : "pointer-events-none", mode === 'draw' && 'cursor-crosshair', mode === 'text' && 'cursor-text')}
          onClick={(e) => mode === 'text' && handleCanvasClick(e)}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
      >
        <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
            {objects.filter((obj): obj is DrawObject => obj.type === 'drawing' && obj.pageIndex === pageIndex).map(obj => (
                <path key={obj.id} d={getSvgPathFromStroke(getStroke(obj.points, { size: obj.strokeWidth, thinning: 0.5 }))} fill={`rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`} />
            ))}
            {currentDrawing && <path d={getSvgPathFromStroke(getStroke(currentDrawing.points, { size: currentDrawing.strokeWidth, thinning: 0.5 }))} fill={`rgb(${currentDrawing.color.r}, ${currentDrawing.color.g}, ${currentDrawing.color.b})`} />}
        </svg>

        {!isLoading && objects.filter((obj): obj is TextObject | ImageObject => (obj.type === 'text' || obj.type === 'image') && obj.pageIndex === pageIndex).map(obj => (
            <Rnd
                key={obj.id} bounds="parent"
                size={{ width: obj.width, height: obj.height }}
                position={{ x: obj.x, y: obj.y }}
                onDragStart={() => onObjectSelect(obj)}
                onDragStop={(e, d) => updateObject(obj.id, { x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                    updateObject(obj.id, { width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...position });
                }}
                className="border-2 border-transparent hover:border-blue-500 hover:border-dashed"
                style={{ pointerEvents: 'auto' }}
                onDoubleClick={() => obj.type === 'text' && handleDoubleClick(obj)}
            >
                {obj.type === 'text' ? (
                  obj.isEditing ? (
                    <textarea
                      value={obj.text}
                      onChange={(e) => handleTextChange(obj.id, e.target.value)}
                      onBlur={() => handleTextBlur(obj)}
                      autoFocus
                      style={{
                        width: '100%', height: '100%', border: 'none', outline: 'none',
                        padding: 0, margin: 0, resize: 'none', background: 'transparent',
                        fontSize: `${obj.size}px`, color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`, fontFamily: obj.font,
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: `${obj.size}px`, color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`, fontFamily: obj.font, whiteSpace: 'pre-wrap', lineHeight: 1.2, height: '100%' }}>{obj.text}</div>
                  )
                ) : (
                    <img src={URL.createObjectURL(new Blob([obj.imageBytes]))} alt="user upload" className="w-full h-full object-contain" />
                )}
            </Rnd>
        ))}
      </div>
    </div>
  );
};
