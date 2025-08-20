import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PDFDocument } from 'pdf-lib';

interface PageThumbnail {
  id: string;
  dataUrl: string;
  pageIndex: number;
}

interface PageArrangerProps {
  files: File[];
  onArrangementChange: (newOrder: number[]) => void;
}

export const PageArranger = ({ files, onArrangementChange }: PageArrangerProps) => {
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      setIsLoading(true);
      const allThumbs: PageThumbnail[] = [];
      
      // Organize PDF only works with one file
      const file = files[0];
      if (!file) {
          setIsLoading(false);
          return;
      }
      
      try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        for (let i = 0; i < totalPages; i++) {
          allThumbs.push({
            id: `page${i}`,
            dataUrl: `Page ${i + 1}`,
            pageIndex: i,
          });
        }
      } catch (e) {
        console.error("Failed to load PDF for page arrangement:", e);
      }
      
      setThumbnails(allThumbs);
      setIsLoading(false);
    };

    generateThumbnails();
  }, [files]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(thumbnails);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setThumbnails(items);
    
    const newOrder = items.map(item => item.pageIndex);
    onArrangementChange(newOrder);
  };
  
  if (isLoading) return <p className="text-center my-8">Loading Pages...</p>;

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
                    className="w-24 h-32 border bg-white rounded shadow-md flex items-center justify-center text-center text-xs p-1"
                  >
                    {thumb.dataUrl}
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
