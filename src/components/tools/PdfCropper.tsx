// src/components/tools/PdfCropper.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Rnd } from 'react-rnd';
import { Loader2 } from 'lucide-react';

export const CROPPER_RENDER_SCALE = 1.5;

export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PdfCropperProps {
  file: File;
  pageIndex: number;
  onCropChange: (box: CropBox) => void;
  initialCropBox?: CropBox;
}

export const PdfCropper = ({ file, pageIndex, onCropChange, initialCropBox }: PdfCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

  const [cropBox, setCropBox] = useState<CropBox>(initialCropBox || { 
    x: 50, y: 50, width: 200, height: 200 
  });

  useEffect(() => {
    onCropChange(cropBox);
  }, [cropBox, onCropChange]);

  useEffect(() => {
    const renderPage = async () => {
      if (!file || !canvasRef.current) return;
      setIsRendered(false);
      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        const viewport = page.getViewport({ scale: CROPPER_RENDER_SCALE });
        
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
    renderPage();
  }, [file, pageIndex]);

  return (
    <div 
      className="relative mx-auto shadow-2xl bg-white"
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
          <div className="w-full h-full border-4 border-dashed border-red-500 bg-black/20 cursor-move relative">
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
               {Math.round(cropBox.width / CROPPER_RENDER_SCALE)} x {Math.round(cropBox.height / CROPPER_RENDER_SCALE)} px
             </div>
          </div>
        </Rnd>
      )}
    </div>
  );
};
