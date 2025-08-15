import { useRef } from "react";
import { Button } from "@/components/ui/button";
import GoogleDriveIcon from "@/components/GoogleDriveIcon";
import DropboxIcon from "@/components/DropboxIcon";

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
        accept=".pdf" // You can adjust this based on the tool
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white border shadow-sm hover:bg-gray-100" aria-label="Select files from Google Drive">
          <GoogleDriveIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white border shadow-sm hover:bg-gray-100" aria-label="Select files from Dropbox">
          <DropboxIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
