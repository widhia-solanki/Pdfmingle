// src/pages/pdf-to-image.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'processing' | 'success' | 'error';

const PdfToImagePage: NextPage = () => {
  const tool = tools['pdf-to-image'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a PDF file to convert.');
      return;
    }
    setStatus('processing');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pdfmingle-backend.onrender.com';
      const response = await fetch(`${apiBaseUrl}/pdf-to-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'A server error occurred.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`${file.name.replace(/\.[^/.]+$/, '')}_images.zip`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been converted to images.' });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Conversion failed: ${message}`);
      setStatus('error');
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setStatus('idle');
    setError(null);
    setDownloadUrl('');
  }, [downloadUrl]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return <ToolProcessor />;
      case 'success':
        return (
          <ToolDownloader
            downloadUrl={downloadUrl}
            onStartOver={handleStartOver}
            filename={processedFileName}
          />
        );
      case 'error':
         return (
            <div className="text-center p-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <Button onClick={handleStartOver} variant="outline">Try Again</Button>
            </div>
        );
      case 'idle':
      default:
        return (
          <ToolUploader
            onFilesSelected={handleFileSelected}
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            selectedFiles={file ? [file] : []}
            isMultiFile={false}
            error={error}
            onProcess={handleProcess}
            actionButtonText="Convert to Images"
          />
        );
    }
  };

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.net/${tool.value}`}
      />
      <main className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{tool.description}</p>
        <div className="mt-10">
          {renderContent()}
        </div>
      </main>
    </>
  );
};

export default PdfToImagePage;
