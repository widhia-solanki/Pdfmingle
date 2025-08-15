import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface PDFProcessorProps {
  onFilesSelected: (files: File[]) => void;
}

export const PDFProcessor = ({ onFilesSelected }: PDFProcessorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <Button 
        onClick={handleFileSelectClick}
        className="w-full max-w-xs h-16 text-xl font-bold bg-ilovepdf-red hover:bg-ilovepdf-red-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        aria-label="Select PDF files from your computer"
      >
        Select PDF files
      </Button>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept=".pdf"
        onChange={handleFileChange}
      />
    </div>
  );
};
