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

type Status = 'idle' | 'arranging' | 'processing' | 'success' | 'error';

const RotatePDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [rotations, setRotations] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
        setStatus('arranging');
    } else {
        setStatus('idle');
    }
  };

  const handleRotate = (index: number) => {
    setRotations((prev) => {
      const currentRotation = prev[index] || 0;
      const newRotation = (currentRotation + 90) % 360;
      return { ...prev, [index]: newRotation };
    });
  };

  const handleFileRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
        setStatus('idle');
    }
    setRotations((prev) => {
      const newRotations = { ...prev };
      delete newRotations[index];
      return newRotations;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file to rotate.');
      return;
    }
    setStatus('processing');
    try {
      setError(null);
      // NOTE: The rotatePdf function from your lib only rotates the first file
      const processed = await rotatePdf(files[0], rotations);
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
    setRotations({});
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
                    isMultiFile={false} // Rotate tool works on one file at a time
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
            </div>
        )}

        {status === 'arranging' && (
             <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                <div className="md:sticky md:top-24">
                  <h2 className="text-2xl font-bold mb-4 text-center md:text-left">File Preview</h2>
                  {files.map((file, index) => (
                    <PDFPreviewer
                      key={index}
                      file={file}
                      index={index}
                      onRemove={handleFileRemove}
                      onRotate={handleRotate}
                      rotationAngle={rotations[index] || 0}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-4 mt-8 md:mt-20">
                    <p className="text-gray-600 text-center">Click the rotate icon on the preview to set the rotation for each page.</p>
                    <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 text-white">
                        Rotate PDF
                    </Button>
                    <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
                </div>
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
