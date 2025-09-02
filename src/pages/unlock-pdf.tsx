// src/pages/unlock-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { UnlockOptions } from '@/components/tools/UnlockOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const UnlockPDFPage: NextPage = () => {
  const tool = tools['unlock-pdf'];
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
      const response = await fetch(`${apiBaseUrl}/api/unlock-pdf`, {
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
      setProcessedFileName(`unlocked_${files[0]?.name || 'document.pdf'}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been unlocked.' });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Unlock failed: ${message}`);
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
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold text-center mb-4">{tool.h1}</h1>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          {tool.description}
        </p>

        {(status === 'idle' || status === 'error') && (
           <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
            <ToolUploader
                onFilesSelected={handleFilesSelected}
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                selectedFiles={files}
                isMultiFile={false}
                error={error}
                onProcess={() => {}}
                actionButtonText=""
            />
             {status === 'error' && <Button onClick={handleStartOver} variant="outline">Try Again</Button>}
           </div>
        )}

        {status === 'options' && (
          <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {files.map((file, index) => (
                 <div key={index} className="relative">
                   <PDFPreviewer
                     file={file}
                     index={index}
                     onRemove={handleFileRemove}
                   />
                   <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center pointer-events-none">
                      <Lock className="h-12 w-12 text-white/70" />
                   </div>
                 </div>
               ))}
             </div>
             <UnlockOptions onUnlock={handleProcess} />
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
      </div>
    </>
  );
};

export default UnlockPDFPage;
