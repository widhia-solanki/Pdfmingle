// src/components/tools/PdfThumbnailViewer.tsx

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfThumbnailViewerProps {
  file: File;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  pageCount: number; // We'll get the page count from the main page
}

export const PdfThumbnailViewer = ({ file, currentPage, onPageChange, pageCount }: PdfThumbnailViewerProps) => {
  const [firstPageThumb, setFirstPageThumb] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // --- THIS IS THE OPTIMIZATION ---
  // This effect now ONLY renders the very first page for a quick preview.
  useEffect(() => {
    const generateFirstPageThumbnail = async () => {
      setIsLoading(true);
      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        const page = await pdf.getPage(1); // Only get the first page
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          setFirstPageThumb(canvas.toDataURL());
        }
      } catch (e) {
        console.error("Failed to generate thumbnail", e);
      } finally {
        setIsLoading(false);
      }
    };

    generateFirstPageThumbnail();
  }, [file]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm mt-2 text-center">Loading Preview...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 border-r">
      {/* First Page Preview */}
      <div className="p-2 border-b">
        <img src={firstPageThumb} alt="PDF Preview" className="w-full shadow-md rounded-sm" />
      </div>
      
      {/* Scrollable List of Page Numbers */}
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-1">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index)}
              className={cn(
                "w-full p-2 text-sm font-medium text-left rounded-md transition-colors",
                currentPage === index 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-200"
              )}
            >
              Page {index + 1}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
