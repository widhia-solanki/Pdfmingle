// src/components/tools/PdfCropper.tsx

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Rnd } from 'react-rnd';
import { Loader2 } from 'lucide-react';

export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfCropperProps {
  file: File;
  pageIndex: number;
  onCropChange: (box: CropBox, scale: number) => void;
  initialCropBox?: CropBox;
}

export const PdfCropper = ({ file, pageIndex, onCropChange, initialCropBox }: PdfCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container to measure
  
  const [isRendered, setIsRendered] = useState(false);
  const [renderScale, setRenderScale] = useState(1.0);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

  const [cropBox, setCropBox] = useState<CropBox>(initialCropBox || { 
    x: 50, y: 50, width: 200, height: 200 
  });

  useEffect(() => {
    onCropChange(cropBox, renderScale);
  }, [cropBox, renderScale, onCropChange]);

  useLayoutEffect(() => {
    const renderPage = async () => {
      if (!file || !canvasRef.current || !containerRef.current) return;
      setIsRendered(false);
      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        const originalViewport = page.getViewport({ scale: 1 });
        
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale to fit page within container with some padding
        const scale = Math.min(
          containerWidth / originalViewport.width,
          containerHeight / originalViewport.height
        ) * 0.95; // 95% to ensure padding

        setRenderScale(scale);
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        setPageDimensions({ width: viewport.width, height: viewport.height });

        if (!initialCropBox) {
          const initialWidth = viewport.width * 0.8;
          const initialHeight = viewport.height * 0.8;
          setCropBox({
            width: initialWidth,
            height: initialHeight,
            x: (viewport.width - initialWidth) / 2,
            y: (viewport.height - initialHeight) / 2,
          });
        }
        
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          setIsRendered(true);
        }
      } catch (error) {
        console.error("Failed to render PDF page:", error);
      }
    };

    // Use ResizeObserver to re-render on container resize
    const observer = new ResizeObserver(renderPage);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    renderPage(); // Initial render

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [file, pageIndex, initialCropBox]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div 
        className="relative shadow-xl bg-white"
        style={{ width: pageDimensions.width, height: pageDimensions.height }}
      >
        {!isRendered && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          </div>
        )}
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
        {isRendered && (
          <Rnd
            bounds="parent"
            size={{ width: cropBox.width, height: cropBox.height }}
            position={{ x: cropBox.x, y: cropBox.y }}
            onDragStop={(e, d) => setCropBox(prev => ({ ...prev, x: d.x, y: d.y }))}
            onResizeStop={(e, direction, ref, delta, position) => {
              setCropBox({
                width: parseFloat(ref.style.width),
                height: parseFloat(ref.style.height),
                ...position,
              });
            }}
            className="z-10"
          >
            <div className="w-full h-full border-4 border-dashed border-blue-600 bg-black/20 cursor-move relative">
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
                 {Math.round(cropBox.width / renderScale)} x {Math.round(cropBox.height / renderScale)} px
               </div>
            </div>
          </Rnd>
        )}
      </div>
    </div>
  );
};
