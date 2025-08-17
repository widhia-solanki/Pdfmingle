import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFProcessorProps {
  onFilesSelected: (files: File[]) => void;
}

export const PDFProcessor = ({ onFilesSelected }: PDFProcessorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "w-full bg-white rounded-lg border-2 border-dashed p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-300",
          isDragging ? "border-brand-blue bg-blue-50" : "border-gray-300"
        )}
      >
        <Upload className={cn("h-16 w-16 mb-4", isDragging ? "text-brand-blue" : "text-gray-400")} />
        <h2 className="text-2xl font-bold text-ilovepdf-text">
          {isDragging ? "Drop your files here!" : "Drag & Drop files here"}
        </h2>
        <p className="text-gray-500 my-2">or</p>
        <Button 
          onClick={handleFileSelectClick}
          className="w-full max-w-xs h-14 text-lg font-semibold bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg"
        >
          Select PDF files
        </Button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
        onChange={handleFileChange}
      />
    </div>
  );
};
