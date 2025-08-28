// src/components/tools/PdfWatermarkPreviewer.tsx

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { WatermarkState } from './WatermarkOptions';

interface PdfWatermarkPreviewerProps {
  file: File;
  pageIndex: number;
  options: WatermarkState;
}

export const PdfWatermarkPreviewer = ({ file, pageIndex, options }: PdfWatermarkPreviewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useLayoutEffect(() => {
    const renderPage = async () => {
      if (!file || !canvasRef.current || !containerRef.current) return;
      setIsRendered(false);
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
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageDimensions({ width: viewport.width, height: viewport.height });
      const context = canvas.getContext('2d');
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        setIsRendered(true);
      }
    };
    renderPage();
  }, [file, pageIndex]);

  useEffect(() => {
    if (options.type === 'image' && options.image) {
      const url = URL.createObjectURL(options.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setImageUrl(null);
  }, [options.image, options.type]);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    pointerEvents: 'none',
    overflow: 'hidden'
  };

  const watermarkElement = options.type === 'text'
    ? <span style={{
        fontSize: `${options.fontSize}px`, color: options.color, opacity: options.opacity,
        transform: `rotate(${options.rotation}deg)`, fontWeight: 'bold', whiteSpace: 'nowrap'
      }}>{options.text}</span>
    : imageUrl
    ? <img src={imageUrl} alt="Watermark Preview" style={{
        opacity: options.opacity, transform: `rotate(${options.rotation}deg)`, 
        maxWidth: '50%', maxHeight: '50%', objectFit: 'contain'
      }} />
    : null;

  // For tiled text, we create an SVG and use it as a repeating background.
  const tiledTextSvg = options.isTiled && options.type === 'text' 
    ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="150px" width="150px"><text x="75" y="75" fill="${options.color}" opacity="${options.opacity}" font-size="${options.fontSize}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${options.rotation}, 75, 75)">${options.text}</text></svg>')`
    : undefined;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div className="relative shadow-xl bg-white" style={{ width: pageDimensions.width, height: pageDimensions.height }}>
        {!isRendered && <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20"><Loader2 className="h-12 w-12 animate-spin text-gray-500"/></div>}
        <canvas ref={canvasRef} />
        {isRendered && (
          <div style={{...overlayStyle, backgroundImage: tiledTextSvg}}>
            {!options.isTiled && watermarkElement}
          </div>
        )}
      </div>
    </div>
  );
};
