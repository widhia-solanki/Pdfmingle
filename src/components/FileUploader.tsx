import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileUploader = ({ files, onFilesChange }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesChange([...files, ...droppedFiles]);
  }, [files, onFilesChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onFilesChange([...files, ...selectedFiles]);
    }
  }, [files, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  }, [files, onFilesChange]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  // This is the function that stops the event from bubbling
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openFileDialog();
  };

  return (
    <div className="space-y-4">
      <Card
        className={`p-8 border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragOver
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog} // This handles clicks on the card area
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-lg font-medium mb-2">
            {isDragOver ? "Drop files here" : "Drag & Drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">or click to select files</p>
          {/* THE FIX IS HERE: We use the new handleButtonClick function */}
          <Button variant="outline" onClick={handleButtonClick} type="button">
            Choose Files
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept=".pdf,.doc,.docx"
        />
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
