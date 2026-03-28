// src/components/tools/PageGrid.tsx

import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageGridProps {
  file: File;
  selectedPages: Set<number>;
  onPageSelect: (pageIndex: number) => void;
  pageRotations: { [key: number]: number };
}

export const PageGrid: React.FC<PageGridProps> = ({ file, selectedPages, onPageSelect, pageRotations }) => {
  const [pageCanvases, setPageCanvases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderAllPages = async () => {
      setIsLoading(true);
      const canvases: string[] = [];
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        if (!e.target?.result) return;
        const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            canvases.push(canvas.toDataURL());
          }
        }
        setPageCanvases(canvases);
        setIsLoading(false);
      };

      fileReader.readAsArrayBuffer(file);
    };

    renderAllPages();
  }, [file]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4 h-64">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-lg font-semibold text-gray-700">Loading all pages...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {pageCanvases.map((canvasDataUrl, index) => (
        <div
          key={index}
          className="relative cursor-pointer group"
          onClick={() => onPageSelect(index)}
        >
          <div
            className={cn(
              "p-1 border-2 rounded-lg transition-all",
              selectedPages.has(index) ? "border-blue-500 bg-blue-100 ring-2 ring-blue-500" : "border-gray-200 bg-white"
            )}
          >
            <img
              src={canvasDataUrl}
              alt={`Page ${index + 1}`}
              className="w-full h-auto rounded-md shadow-sm transition-transform duration-300"
              style={{ transform: `rotate(${pageRotations[index] || 0}deg)` }}
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
            {selectedPages.has(index) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
            )}
            <div className="absolute bottom-1 bg-gray-800 text-white text-xs rounded-full px-2 py-1">
              Page {index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
