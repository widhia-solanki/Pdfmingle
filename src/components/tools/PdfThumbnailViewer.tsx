// src/components/tools/PdfThumbnailViewer.tsx

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- THIS IS THE FIX ---
// We now load the worker from a reliable CDN.
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

interface PdfThumbnailViewerProps {
  file: File;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  pageCount: number;
}

export const PdfThumbnailViewer = ({ file, currentPage, onPageChange, pageCount }: PdfThumbnailViewerProps) => {
  const [thumbnails, setThumbnails] = useState<string[]>(Array(pageCount).fill(''));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      setIsLoading(true);
      try {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        
        setThumbnails(Array(pdf.numPages).fill(''));

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            setThumbnails(prev => {
              const newThumbs = [...prev];
              newThumbs[i - 1] = canvas.toDataURL();
              return newThumbs;
            });
          }
        }
      } catch (e) {
        console.error("Failed to generate thumbnails", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (file && pageCount > 0) {
      generateThumbnails();
    }
  }, [file, pageCount]);

  return (
    <ScrollArea className="w-full h-full bg-gray-100 p-2 border-r">
      <div className="space-y-2">
        {thumbnails.map((src, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={cn(
              "w-full p-1 border-2 rounded-md transition-all",
              currentPage === index ? "border-blue-500" : "border-transparent hover:border-gray-400"
            )}
          >
            {src ? (
              <img src={src} alt={`Page ${index + 1}`} className="w-full shadow-md rounded-sm" />
            ) : (
              <div className="w-full aspect-[2/3] bg-white flex items-center justify-center rounded-sm shadow-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            <p className="text-xs font-semibold mt-1">{index + 1}</p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
