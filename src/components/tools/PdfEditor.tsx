// src/components/tools/PdfEditor.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Rnd } from 'react-rnd';
import getStroke from 'perfect-freehand';
import { getSvgPathFromStroke } from '@/lib/pdf/getSvgPathFromStroke';
import { EditableObject, TextObject, ImageObject, DrawObject, HighlightObject, ShapeObject } from '@/lib/pdf/edit';
import { ToolMode } from './AdvancedEditorToolbar';
import { Loader2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export const RENDER_SCALE = 2;

interface PdfEditorProps {
  file: File;
  pageIndex: number;
  objects: EditableObject[];
  onObjectsChange: (objects: EditableObject[]) => void;
  mode: ToolMode;
  onObjectSelect: (object: EditableObject | null) => void;
}

export const PdfEditor = ({ file, pageIndex, objects, onObjectsChange, mode, onObjectSelect }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionCanvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [isRendered, setIsRendered] = useState(false);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number, y: number, pressure: number }[]>([]);

  const pageObjects = objects.filter(obj => obj.pageIndex === pageIndex);

  useEffect(() => {
    const renderPage = async () => {
      if (!file || !canvasRef.current) return;
      setIsRendered(false);
      const fileBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      const page = await pdf.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: RENDER_SCALE });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      setPageDimensions({ width: viewport.width, height: viewport.height });

      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        setIsRendered(true);
      }
    };
    renderPage();
  }, [file, pageIndex]);
  
  useEffect(() => {
    if (!isRendered || !interactionCanvasRef.current) return;
    const canvas = interactionCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    pageObjects.forEach(obj => {
      if (obj.type === 'drawing' || obj.type === 'highlight') {
        const stroke = getStroke(obj.points, { size: obj.strokeWidth });
        const pathData = new Path2D(getSvgPathFromStroke(stroke));
        ctx.fillStyle = `rgba(${obj.color.r}, ${obj.color.g}, ${obj.color.b}, ${obj.type === 'highlight' ? obj.opacity : 1.0})`;
        ctx.fill(pathData);
      } else if (obj.type === 'shape' && obj.shapeType === 'rectangle') {
        ctx.fillStyle = `rgba(${obj.fillColor.r}, ${obj.fillColor.g}, ${obj.fillColor.b}, ${obj.fillColor.a})`;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        if (obj.borderWidth > 0) {
          ctx.strokeStyle = `rgb(${obj.borderColor.r}, ${obj.borderColor.g}, ${obj.borderColor.b})`;
          ctx.lineWidth = obj.borderWidth;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }
      }
    });
  }, [pageObjects, isRendered, pageDimensions]);

  const updateObject = (id: string, newProps: Partial<EditableObject>) => {
    const updatedObjects = objects.map(obj =>
      obj.id === id ? { ...obj, ...newProps } : obj
    );
    onObjectsChange(updatedObjects as EditableObject[]);
  };
  
  const handleDoubleClick = (obj: TextObject) => {
    if (mode === 'select') {
      updateObject(obj.id, { isEditing: true });
    }
  };

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [objects]);

  // --- THIS IS THE FIX ---
  // A comprehensive handler for mouse down events that checks the current tool mode.
  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (mode) {
      case 'draw':
      case 'highlight':
        setIsDrawing(true);
        setCurrentPoints([{ x, y, pressure: 0.5 }]);
        break;
      
      case 'text':
        const newText: TextObject = {
          type: 'text',
          id: `text-${Date.now()}`,
          pageIndex,
          x,
          y,
          text: 'New Text',
          size: 16 * RENDER_SCALE,
          font: 'Helvetica',
          color: { r: 0, g: 0, b: 0 },
          width: 150 * RENDER_SCALE,
          height: 20 * RENDER_SCALE,
          isEditing: true, // Start in editing mode
        };
        onObjectsChange([...objects, newText]);
        onObjectSelect(newText);
        break;

      case 'shape':
        const newShape: ShapeObject = {
          type: 'shape',
          shapeType: 'rectangle',
          id: `shape-${Date.now()}`,
          pageIndex,
          x,
          y,
          width: 100 * RENDER_SCALE,
          height: 100 * RENDER_SCALE,
          fillColor: { r: 255, g: 255, b: 0, a: 0.5 },
          borderColor: { r: 0, g: 0, b: 0 },
          borderWidth: 2 * RENDER_SCALE,
        };
        onObjectsChange([...objects, newShape]);
        onObjectSelect(newShape);
        break;
      
      case 'select':
      default:
        // Do nothing on click if in select mode
        break;
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCurrentPoints([...currentPoints, { x: e.clientX - rect.left, y: e.clientY - rect.top, pressure: 0.5 }]);
  };

  const handlePointerUp = () => {
    if (!isDrawing || currentPoints.length === 0) return;
    
    const newObject: DrawObject | HighlightObject = mode === 'draw' ? {
      type: 'drawing',
      id: `draw-${Date.now()}`,
      pageIndex,
      points: currentPoints,
      color: { r: 0, g: 0, b: 0 },
      strokeWidth: 5 * RENDER_SCALE,
    } : {
      type: 'highlight',
      id: `highlight-${Date.now()}`,
      pageIndex,
      points: currentPoints,
      color: { r: 255, g: 255, b: 0 },
      strokeWidth: 20 * RENDER_SCALE,
      opacity: 0.5,
    };

    onObjectsChange([...objects, newObject]);
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  return (
    <div 
      className="relative shadow-lg" 
      style={{ width: pageDimensions.width, height: pageDimensions.height }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
    >
      {!isRendered && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      )}
      <canvas ref={canvasRef} />
      <canvas ref={interactionCanvasRef} width={pageDimensions.width} height={pageDimensions.height} className="absolute top-0 left-0 pointer-events-none" />

      {pageObjects.map(obj => {
        if (obj.type === 'text' || obj.type === 'image' || obj.type === 'shape') {
          return (
            <Rnd
              key={obj.id}
              size={{ width: obj.width, height: obj.height }}
              position={{ x: obj.x, y: obj.y }}
              onDragStop={(e, d) => updateObject(obj.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateObject(obj.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position,
                });
              }}
              onClick={() => onObjectSelect(obj)}
              onDoubleClick={() => obj.type === 'text' && handleDoubleClick(obj)}
              disableDragging={mode !== 'select'}
              enableResizing={mode === 'select'}
              className={mode === 'select' ? 'cursor-pointer border-2 border-dashed border-blue-500' : 'pointer-events-none'}
            >
              {obj.type === 'text' ? (
                 obj.isEditing ? (
                  <textarea
                    ref={textInputRef}
                    value={obj.text}
                    onChange={(e) => updateObject(obj.id, { text: e.target.value })}
                    onBlur={() => updateObject(obj.id, { isEditing: false })}
                    style={{
                      width: '100%', height: '100%', border: 'none', padding: 0,
                      margin: 0, background: 'rgba(255, 255, 255, 0.7)', outline: 'none', resize: 'none',
                      fontSize: obj.size, fontFamily: obj.font,
                      color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`
                    }}
                  />
                ) : (
                  <div style={{ fontSize: obj.size, fontFamily: obj.font, color: `rgb(${obj.color.r}, ${obj.color.g}, ${obj.color.b})`, whiteSpace: 'pre-wrap' }}>{obj.text}</div>
                )
              ) : obj.type === 'image' ? (
                <img src={URL.createObjectURL(new Blob([obj.imageBytes]))} alt="user content" style={{ width: '100%', height: '100%' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: `rgba(${obj.fillColor.r}, ${obj.fillColor.g}, ${obj.fillColor.b}, ${obj.fillColor.a})`, border: `${obj.borderWidth}px solid rgb(${obj.borderColor.r}, ${obj.borderColor.g}, ${obj.borderColor.b})` }} />
              )}
            </Rnd>
          );
        }
        return null;
      })}
    </div>
  );
};
