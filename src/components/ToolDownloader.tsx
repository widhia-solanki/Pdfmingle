// src/components/tools/ToolDownloader.tsx

import { Button } from '@/components/ui/button';
import { Download, CheckCircle, RotateCw } from 'lucide-react';
import Link from 'next/link';

interface ToolDownloaderProps {
  downloadUrl: string;
  onStartOver: () => void;
}

export const ToolDownloader = ({ downloadUrl, onStartOver }: ToolDownloaderProps) => (
  <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center gap-6 p-8 bg-green-50 border-2 border-green-200 rounded-xl">
    <CheckCircle className="w-20 h-20 text-green-500" />
    <h2 className="text-3xl font-bold text-gray-800">Processing Complete!</h2>
    <p className="text-gray-600">Your file is ready for download.</p>
    <div className="w-full flex flex-col items-center gap-4 mt-4">
      <Link href={downloadUrl} download passHref legacyBehavior>
        <a className="w-full">
          <Button size="lg" className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700">
            <Download className="mr-3 h-6 w-6" />
            Download File
          </Button>
        </a>
      </Link>
      <Button variant="outline" onClick={onStartOver} className="w-full h-12 text-lg">
        <RotateCw className="mr-2 h-5 w-5" />
        Start Over
      </Button>
    </div>
  </div>
);
