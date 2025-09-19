// src/pages/protect-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { ProtectOptions } from '@/components/tools/ProtectOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const ProtectPDFPage: NextPage = () => {
  const tool = tools['protect-pdf'];
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setError(null);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setStatus('options');
    } else {
      setStatus('idle');
    }
  };

  const handleFileRemove = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setStatus('idle');
    }
  };

  const handleProcess = async (password: string) => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }

    setStatus('processing');
    setError(null);

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('password', password);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pdfmingle-backend.onrender.com';
      const response = await fetch(`${apiBaseUrl}/api/protect-pdf`, {
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
      setProcessedFileName(`protected_${files[0]?.name || 'document.pdf'}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been protected.' });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Protection failed: ${message}`);
      setStatus('error');
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setError(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessedFileName('');
  }, [downloadUrl]);

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.com/${tool.value}`}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Render content based on status */}
        
        {status === 'processing' ? <ToolProcessor /> :
         status === 'success' ? <ToolDownloader downloadUrl={downloadUrl} filename={processedFileName} onStartOver={handleStartOver} /> :
         (
          <>
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground">{tool.h1}</h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">{tool.description}</p>
            </div>

            {/* Main Content: Uploader or Editor */}
            {files.length === 0 ? (
              <div className="max-w-2xl mx-auto">
                <ToolUploader
                  onFilesSelected={handleFilesSelected}
                  acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                  selectedFiles={files}
                  isMultiFile={false}
                  error={error}
                  onProcess={() => {}}
                  actionButtonText=""
                />
                {status === 'error' && <Button onClick={handleStartOver} variant="outline" className="mt-4">Try Again</Button>}
              </div>
            ) : (
              // --- THIS IS THE NEW SIDE-BY-SIDE LAYOUT ---
              <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12">
                
                {/* Left Column: PDF Preview */}
                <div className="md:col-span-7 lg:col-span-8 flex justify-center items-start">
                  {files.map((file, index) => (
                    <PDFPreviewer
                      key={index}
                      file={file}
                      index={index}
                      onRemove={handleFileRemove}
                    />
                  ))}
                </div>
                
                {/* Right Column: Password Options */}
                <div className="md:col-span-5 lg:col-span-4 mt-6 md:mt-0">
                  <div className="bg-card border border-border rounded-lg shadow-md p-6 sticky top-24">
                    <ProtectOptions onPasswordSet={handleProcess} />
                  </div>
                </div>
                
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProtectPDFPage;
