// src/pages/add-watermark.tsx

import React, { useState, useCallback } from 'react'; // --- THIS IS THE FIX ---
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PdfThumbnailViewer } from '@/components/tools/PdfThumbnailViewer';
import { PdfWatermarkPreviewer } from '@/components/tools/PdfWatermarkPreviewer';
import { WatermarkOptions, WatermarkState } from '@/components/tools/WatermarkOptions';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Droplets } from 'lucide-react';
import { addWatermarkToPdf } from '@/lib/pdf/watermark';

// Correctly configure the PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
}

type Status = 'idle' | 'previewing' | 'processing' | 'success' | 'error';

const defaultOptions: WatermarkState = {
    type: 'text',
    text: 'CONFIDENTIAL',
    image: null,
    opacity: 0.5,
    rotation: -45,
    positioning: 'tiled',
    position: 'center',
    color: '#ff0000',
    fontSize: 48,
};

const AddWatermarkPage: NextPage = () => {
  const tool = tools['add-watermark'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [options, setOptions] = useState<WatermarkState>(defaultOptions);
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = async (selectedFiles: File[]) => {
    setError(null);
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      setFile(selectedFile);
      setStatus('previewing');
      try {
        const fileBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        setPageCount(pdf.numPages);
      } catch (e) {
        console.error("PDF.js Error:", e);
        setError("Could not read PDF. It may be corrupt or password-protected.");
        setStatus('idle'); 
        setFile(null);
      }
    }
  };
  
  const handleProcess = async () => {
    if (!file) return;

    if (options.type === 'image' && !options.image) {
        toast({ title: 'No Image Selected', description: 'Please select an image file for the watermark.', variant: 'destructive'});
        return;
    }

    setStatus('processing');
    setError(null);

    try {
      const watermarkedPdfBytes = await addWatermarkToPdf(file, options);
      
      const blob = new Blob([watermarkedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`watermarked_${file.name}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Watermark added successfully.' });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Processing failed: ${message}`);
      setStatus('error');
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setPageCount(0);
    setCurrentPage(0);
    setOptions(defaultOptions);
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }, [downloadUrl]);

  return (
    <>
      <NextSeo title={tool.metaTitle} description={tool.metaDescription} canonical={`https://pdfmingle.com/${tool.value}`} />
      <main className="w-full">
        {(status === 'idle' || status === 'error') ? (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader onFilesSelected={handleFileSelected} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} selectedFiles={file ? [file] : []} isMultiFile={false} error={error} onProcess={() => {}} actionButtonText={tool.label} />
            {status === 'error' && (<Button onClick={handleStartOver} variant="outline" className="mt-4">Try Again</Button>)}
          </div>
        ) : status === 'previewing' && file ? (
           <div className="flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
            <div className="w-full md:w-64 flex-shrink-0 h-48 md:h-full border-r bg-gray-50 shadow-md">
              <PdfThumbnailViewer file={file} currentPage={currentPage} onPageChange={setCurrentPage} pageCount={pageCount} />
            </div>
            <div className="flex-grow h-full flex items-center justify-center bg-gray-400 p-4 overflow-auto">
              <PdfWatermarkPreviewer file={file} pageIndex={currentPage} options={options} />
            </div>
            <div className="w-full md:w-80 flex-shrink-0 bg-gray-50 p-6 flex flex-col shadow-lg border-l">
              <div className="flex-grow overflow-y-auto pr-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Watermark Options</h2>
                <WatermarkOptions options={options} onOptionChange={setOptions} />
              </div>
              <Button size="lg" onClick={handleProcess} className="w-full mt-6 bg-brand-blue hover:bg-brand-blue-dark font-bold py-6 text-lg flex-shrink-0">
                <Droplets className="mr-2 h-5 w-5"/>
                Add Watermark
              </Button>
            </div>
          </div>
        ) : status === 'processing' ? (
          <div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>
        ) : status === 'success' ? (
          <div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} /></div>
        ) : null }
      </main>
    </>
  );
};

export default AddWatermarkPage;

### Summary of the Fix:

1.  **Corrected React Import:** I replaced the invalid `import React, 'react';` with the correct syntax: `import React, { useState, useCallback } from 'react';`.
2.  **Cleaned Up Hook Usage:** I removed the unnecessary `React.` prefix from `useState` and `useCallback` calls, as they are now directly imported. This is standard practice and improves readability.

This code is now syntactically correct and will resolve the build error.
