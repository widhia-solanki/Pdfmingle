// src/components/tools/PdfThumbnailViewer.tsx

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PdfThumbnailViewerProps {
  file: File;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
}

export const PdfThumbnailViewer = ({ file, currentPage, onPageChange }: PdfThumbnailViewerProps) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      setIsLoading(true);
      const allThumbnails: string[] = [];
      const fileBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 }); // Low scale for small thumbnails
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          allThumbnails.push(canvas.toDataURL());
        }
      }
      setThumbnails(allThumbnails);
      setIsLoading(false);
    };

    generateThumbnails();
  }, [file]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm mt-2">Loading Pages...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-100 p-2 space-y-2 border-r">
      {thumbnails.map((src, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={cn(
            "w-full p-1 border-2 rounded-md transition-all",
            currentPage === index ? "border-blue-500" : "border-transparent hover:border-gray-400"
          )}
        >
          <img src={src} alt={`Page ${index + 1}`} className="w-full shadow-md rounded-sm" />
          <p className="text-xs font-semibold mt-1">{index + 1}</p>
        </button>
      ))}
    </div>
  );
};
