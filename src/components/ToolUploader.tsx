// src/components/ToolUploader.tsx

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onProcess: () => void;
  acceptedFileTypes: { [key: string]: string[] };
  actionButtonText: string;
  selectedFiles: File[];
  isMultiFile: boolean;
  error: string | null;
}

export const ToolUploader = ({ onFilesSelected, onProcess, acceptedFileTypes, actionButtonText, selectedFiles, isMultiFile, error }: ToolUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isMultiFile) {
      onFilesSelected([...selectedFiles, ...acceptedFiles]);
    } else {
      onFilesSelected([acceptedFiles[0]]);
    }
  }, [isMultiFile, selectedFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: isMultiFile,
    noClick: true, // This prevents the whole dropzone from being clickable
    noKeyboard: true,
  });

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div
        {...getRootProps()}
        className={cn('w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors', isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300')}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <UploadCloud className="w-16 h-16" />
          <p className="text-lg font-semibold">Drag & drop files here</p>
          <p className="text-gray-400">- or -</p>
          {/* --- THIS IS THE NEW BUTTON --- */}
          <Button
            type="button"
            onClick={open} // This function is provided by react-dropzone to open the file dialog
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Select File
          </Button>
          <p className="text-sm mt-2">Supported types: {Object.values(acceptedFileTypes).flat().join(', ')}</p>
        </div>
      </div>

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="w-full space-y-2">
          <h3 className="font-semibold text-lg text-left">Selected Files:</h3>
          {selectedFiles.map((file, index) => (
            <div key={index} className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
                <span className="text-sm text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button size="lg" onClick={onProcess} disabled={selectedFiles.length === 0} className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-red-500 hover:bg-red-600">
        {actionButtonText}
      </Button>
    </div>
  );
};```

**Changes I made:**

1.  **Modified `useDropzone`:** I added `noClick: true` and `noKeyboard: true` to the `useDropzone` hook. This tells the library that we want to handle the file dialog trigger manually.
2.  **Added the Button:** I added a new `<Button>` inside the dropzone area.
3.  **Connected `onClick`:** The `useDropzone` hook provides a special function called `open`. I connected this function to the `onClick` event of the new button. When the button is clicked, it will now open the native file selection window.

After updating this one file, your uploader will now have a clear and functional "Select File" button in addition to the drag-and-drop area.
