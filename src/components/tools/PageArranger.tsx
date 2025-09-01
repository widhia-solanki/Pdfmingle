// src/components/tools/PageArranger.tsx

import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, Trash2, RotateCw, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageObject } from '@/lib/pdf/organize';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PageThumbnailProps {
  file: File;
  page: PageObject;
  index: number;
}

// Single Page Thumbnail Component with lazy loading
const PageThumbnail = React.memo(({ file, page, index }: PageThumbnailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true }); // Only render once when visible
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (inView && !isRendered) {
      const renderPage = async () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          if (!e.target?.result) return;
          const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          const pdfPage = await pdf.getPage(page.originalIndex + 1);
          const viewport = pdfPage.getViewport({ scale: 0.4 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await pdfPage.render({ canvasContext: context, viewport }).promise;
          setIsRendered(true);
        };
        fileReader.readAsArrayBuffer(file);
      };
      renderPage();
    }
  }, [inView, isRendered, file, page.originalIndex]);

  return (
    <div ref={ref} className="w-full h-48 flex items-center justify-center">
      {isRendered ? (
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-md shadow-md transition-transform" style={{ transform: `rotate(${page.rotation}deg)` }}/>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
});

PageThumbnail.displayName = 'PageThumbnail';


interface PageArrangerProps {
  file: File;
  pages: PageObject[];
  onPagesChange: (pages: PageObject[]) => void;
}

export const PageArranger: React.FC<PageArrangerProps> = ({ file, pages, onPagesChange }) => {
  const [viewingPage, setViewingPage] = useState<PageObject | null>(null);
  const [highResCanvas, setHighResCanvas] = useState<string>('');
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  
  useEffect(() => {
    const renderHighResPage = async () => {
      if (!viewingPage || !file) return;
      setIsDialogLoading(true);
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        if (!e.target?.result) return;
        const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(viewingPage.originalIndex + 1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const context = canvas.getContext('2d');
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          setHighResCanvas(canvas.toDataURL());
        }
        setIsDialogLoading(false);
      };
      fileReader.readAsArrayBuffer(file);
    };
    renderHighResPage();
  }, [viewingPage, file]);


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onPagesChange(items);
  };

  const rotatePage = (index: number) => {
    const newPages = [...pages];
    const page = newPages[index];
    page.rotation = (page.rotation + 90) % 360;
    onPagesChange(newPages);
  };

  const deletePage = (index: number) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    onPagesChange(newPages);
  };
  
  if (!pages.length) {
    return (
        <div className="flex flex-col items-center justify-center p-12 gap-4 h-64">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-700">Loading all pages...</p>
        </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pages-droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 bg-gray-100 rounded-lg border min-h-[10rem]"
            >
              {pages.map((page, index) => (
                <Draggable key={page.id} draggableId={page.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(
                        "p-1.5 bg-white rounded-lg shadow-sm relative group outline-none",
                        snapshot.isDragging && "shadow-xl scale-105 ring-2 ring-blue-500"
                      )}
                    >
                      <PageThumbnail file={file} page={page} index={index} />
                      <div className="absolute top-1 right-1 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="icon" variant="outline" className="h-6 w-6 bg-white" onClick={() => setViewingPage(page)}>
                            <ZoomIn className="h-4 w-4" />
                         </Button>
                         <Button size="icon" variant="outline" className="h-6 w-6 bg-white" onClick={() => rotatePage(index)}>
                            <RotateCw className="h-4 w-4" />
                         </Button>
                         <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => deletePage(index)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                          {index + 1}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={viewingPage !== null} onOpenChange={() => setViewingPage(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Page {viewingPage ? viewingPage.originalIndex + 1 : ''}</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center overflow-auto">
            {isDialogLoading ? (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            ) : (
              <img src={highResCanvas} alt="High-resolution page preview" className="max-w-full max-h-full object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
