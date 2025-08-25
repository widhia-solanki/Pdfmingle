// src/pages/protect-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { ProtectOptions } from '@/components/tools/ProtectOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
// --- THIS IS THE FIX: The unused import is removed ---
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const ProtectPDFPage: NextPage = () => {
  // The 'protect-pdf' key will cause an error until we add it to tools.ts
  // We will assume it exists for now and add it in the next step.
  const tool = tools['protect-pdf'] || {
    metaTitle: 'Protect PDF',
    metaDescription: 'Add a password to your PDF.',
    value: 'protect-pdf',
    h1: 'Protect PDF',
    description: 'Add a password to encrypt and secure your PDF file.'
  };
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
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

  // --- THIS IS THE FIX: This function now calls the backend API ---
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
      const response = await fetch(`${apiBaseUrl}/protect-pdf`, {
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
        canonical={`https://pdfmingle.net/${tool.value}`}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">{tool.h1}</h1>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {tool.description}
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

        {status === 'options' && (
          <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {files.map((file, index) => (
                 <PDFPreviewer
                   key={index}
                   file={file}
                   index={index}
                   onRemove={handleFileRemove}
                 />
               ))}
             </div>
             <ProtectOptions onPasswordSet={handleProcess} />
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

export default ProtectPDFPage;
