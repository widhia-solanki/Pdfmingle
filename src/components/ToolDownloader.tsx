// src/components/ToolDownloader.tsx

import { Button } from '@/components/ui/button';
import { Download, CheckCircle, RotateCw } from 'lucide-react';

interface ToolDownloaderProps {
  downloadUrl: string;
  onStartOver: () => void;
  filename: string;
}

export const ToolDownloader = ({ downloadUrl, onStartOver, filename }: ToolDownloaderProps) => {
  return (
    // THE FIX: Use semantic theme variables for background, border, and text.
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center gap-6 p-8 bg-green-500/10 border-2 border-green-500/20 rounded-xl">
      <CheckCircle className="w-20 h-20 text-green-500" />
      <h2 className="text-3xl font-bold text-foreground">Processing Complete!</h2>
      <p className="text-muted-foreground">Your file is ready for download.</p>
      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <a href={downloadUrl} download={filename} className="w-full">
          {/* Using a brand color for the primary action is good. */}
          <Button size="lg" className="w-full h-16 text-xl font-bold bg-brand-blue hover:bg-brand-blue-dark text-white">
            <Download className="mr-3 h-6 w-6" />
            Download {filename}
          </Button>
        </a>
        <Button variant="outline" onClick={onStartOver} className="w-full h-12 text-lg">
          <RotateCw className="mr-2 h-5 w-5" />
          Start Over
        </Button>
      </div>
    </div>
  );
};
