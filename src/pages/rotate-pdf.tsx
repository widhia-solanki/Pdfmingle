// src/pages/rotate-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { rotatePdf } from '@/lib/pdf/rotate';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { RotateCw, Download } from 'lucide-react'; // Import icons

type Status = 'idle' | 'arranging' | 'processing' | 'success' | 'error';

const RotatePDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  // Simplified rotation state for a single file
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setRotation(0); // Reset rotation on new file
    if (selectedFiles.length > 0) {
        setStatus('arranging');
    } else {
        setStatus('idle');
    }
  };

  const handleRotateClick = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleFileRemove = () => {
    setFiles([]);
    setStatus('idle');
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file to rotate.');
      return;
    }
    setStatus('processing');
    try {
      setError(null);
      // We need to apply the rotation to all pages, so we pass the single rotation value
      const rotationsForAllPages: { [key: number]: number } = {};
      // This assumes we need to know the page count to apply rotation to all pages.
      // Let's adjust rotatePdf to handle a single angle for all pages.
      const processed = await rotatePdf(files[0], rotation);
      const blob = new Blob([processed], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`rotated_${files[0]?.name || 'document.pdf'}`);
      setStatus('success');
    } catch (err) {
      setError('An error occurred while rotating the PDF.');
      console.error(err);
      setStatus('error');
    }
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setRotation(0);
    setError(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessedFileName('');
  }, [downloadUrl]);

  return (
    <>
      <Head>
        <title>Rotate PDF Pages – Free Online Tool</title>
        <meta name="description" content="Rotate and flip PDF pages easily. Free, secure, and simple to use online tool." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Rotate PDF Pages – Free Online Tool</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Rotate and flip PDF pages easily. Free, secure, and simple to use online tool.
        </p>
        
        {status === 'idle' && (
            <div className="max-w-4xl mx-auto">
                <ToolUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                    selectedFiles={files}
                    isMultiFile={false}
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
            </div>
        )}

        {status === 'arranging' && files.length > 0 && (
             <div className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
                <div className="p-4 border-2 border-dashed rounded-xl w-full bg-gray-50">
                    <h2 className="text-2xl font-bold mb-4 text-center">File Preview</h2>
                    <div className="flex justify-center">
                        <PDFPreviewer
                          file={files[0]}
                          index={0}
                          onRemove={handleFileRemove}
                          rotationAngle={rotation}
                        />
                    </div>
                </div>
                
                <p className="text-lg font-medium text-gray-700">
                    Current Rotation: <span className="font-bold text-blue-600">{rotation}°</span>
                </p>

                <div className="w-full flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" onClick={handleRotateClick} className="w-full sm:w-auto" variant="outline">
                        <RotateCw className="mr-2 h-5 w-5" />
                        Rotate
                    </Button>
                    <Button size="lg" onClick={handleProcess} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">
                        <Download className="mr-2 h-5 w-5" />
                        Apply & Download
                    </Button>
                </div>
                <Button variant="link" onClick={handleStartOver}>Choose a different file</Button>
            </div>
        )}

        {status === 'processing' && <ToolProcessor />}
        
        {status === 'success' && (
          <ToolDownloader
            downloadUrl={downloadUrl}
            filename={processedFileName}
            onStartOver={handleStartOver}
          />
        )}

        {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <Button onClick={handleStartOver} variant="outline">Try Again</Button>
            </div>
        )}
      </div>
    </>
  );
};

export default RotatePDFPage;
