// src/components/tools/PdfMarginPreviewer.tsx

import React, { useState, useLayoutEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { MarginState } from '@/lib/pdf/crop';

interface PdfMarginPreviewerProps {
  file: File;
  pageIndex: number;
  margins: MarginState;
  onDimensionsChange: (dims: { width: number; height: number }) => void;
}

export const PdfMarginPreviewer = ({ file, pageIndex, margins, onDimensionsChange }: PdfMarginPreviewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

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
        const scale = Math.min(
          (container.clientWidth * 0.9) / originalViewport.width,
          (container.clientHeight * 0.9) / originalViewport.height
        );
        
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        setPageDimensions({ width: viewport.width, height: viewport.height });
        onDimensionsChange({ width: originalViewport.width, height: originalViewport.height });
        
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          setIsRendered(true);
        }
      } catch (error) {
        console.error("Failed to render PDF page:", error);
      }
    };
    
    const observer = new ResizeObserver(renderPage);
    if (containerRef.current) observer.observe(containerRef.current);
    renderPage();
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, [file, pageIndex, onDimensionsChange]);

  const getMaskStyle = (side: 'top' | 'bottom' | 'left' | 'right'): React.CSSProperties => {
    const { top, bottom, left, right, unit } = margins;
    const valueUnit = unit === '%' ? '%' : 'px';
    
    // --- THIS IS THE FIX ---
    // Explicitly cast the position property to satisfy TypeScript's strict CSS property types.
    const baseStyle: React.CSSProperties = { 
        position: 'absolute' as 'absolute', 
        backgroundColor: 'rgba(107, 114, 128, 0.5)', 
        zIndex: 10 
    };

    switch (side) {
      case 'top': return { ...baseStyle, top: 0, left: 0, right: 0, height: `${top}${valueUnit}` };
      case 'bottom': return { ...baseStyle, bottom: 0, left: 0, right: 0, height: `${bottom}${valueUnit}` };
      case 'left': return { ...baseStyle, top: `${top}${valueUnit}`, bottom: `${bottom}${valueUnit}`, left: 0, width: `${left}${valueUnit}` };
      case 'right': return { ...baseStyle, top: `${top}${valueUnit}`, bottom: `${bottom}${valueUnit}`, right: 0, width: `${right}${valueUnit}` };
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div className="relative shadow-xl bg-white" style={{ width: pageDimensions.width, height: pageDimensions.height }}>
        {!isRendered && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          </div>
        )}
        <canvas ref={canvasRef} />
        {isRendered && (
          <>
            <div style={getMaskStyle('top')} />
            <div style={getMaskStyle('bottom')} />
            <div style={getMaskStyle('left')} />
            <div style={getMaskStyle('right')} />
          </>
        )}
      </div>
    </div>
  );
};
