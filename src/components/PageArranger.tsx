// src/components/tools/PageArranger.tsx

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PDFDocument } from 'pdf-lib';

interface PageThumbnail {
  id: string;
  dataUrl: string; // Placeholder for now
  pageIndex: number;
  originalFileIndex: number;
}

interface PageArrangerProps {
  files: File[];
  onArrangementChange: (newOrder: { pageIndex: number; originalFileIndex: number }[]) => void;
}

export const PageArranger = ({ files, onArrangementChange }: PageArrangerProps) => {
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      setIsLoading(true);
      const allThumbs: PageThumbnail[] = [];
      
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        try {
          const pdfBytes = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const totalPages = pdfDoc.getPageCount();

          for (let i = 0; i < totalPages; i++) {
            // Using a placeholder as real thumbnail generation is very slow client-side
            allThumbs.push({
              id: `file${fileIndex}-page${i}`,
              dataUrl: `Page ${i + 1} of ${file.name}`,
              pageIndex: i,
              originalFileIndex: fileIndex,
            });
          }
        } catch (e) {
          console.error("Failed to load a PDF for thumbnail generation:", e);
        }
      }
      setThumbnails(allThumbs);
      setIsLoading(false);
    };

    if (files.length > 0) {
      generateThumbnails();
    } else {
      setThumbnails([]);
    }
  }, [files]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(thumbnails);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setThumbnails(items);
    
    const newOrder = items.map(item => ({ pageIndex: item.pageIndex, originalFileIndex: item.originalFileIndex }));
    onArrangementChange(newOrder);
  };
  
  if (isLoading) {
    return <p className="text-center my-8">Loading page previews...</p>;
  }

  if (thumbnails.length === 0 && !isLoading) {
    return <p className="text-center my-8 text-red-500">Could not load pages. The file may be corrupt.</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="pages" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-wrap items-center justify-center gap-4 p-4 border rounded-lg bg-gray-100 min-h-[10rem]"
          >
            {thumbnails.map((thumb, index) => (
              <Draggable key={thumb.id} draggableId={thumb.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="w-24 h-32 border bg-white rounded shadow-md flex flex-col items-center justify-center text-center text-xs p-1 break-words"
                  >
                    <span className="font-bold">Page {thumb.pageIndex + 1}</span>
                    <span className="text-gray-500 text-[10px] mt-1 truncate w-full">{thumb.dataUrl.split(' of ')[1]}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
