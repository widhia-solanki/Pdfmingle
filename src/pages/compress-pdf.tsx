// src/pages/compress-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { CompressOptions, CompressionLevel } from '@/components/tools/CompressOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const CompressPDFPage: NextPage = () => {
  const tool = tools['compress-pdf'];
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setOriginalSize(selectedFiles[0].size);
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

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file.');
      return;
    }

    setStatus('processing');
    setError(null);

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('level', compressionLevel);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pdfmingle-backend.onrender.com';
      const response = await fetch(`${apiBaseUrl}/compress-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'A server error occurred.');
      }

      const blob = await response.blob();
      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`compressed_${files[0]?.name || 'document.pdf'}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been compressed.' });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Compression failed: ${message}`);
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
    setOriginalSize(0);
    setCompressedSize(0);
  }, [downloadUrl]);
  
  const sizeToMB = (size: number) => (size / 1024 / 1024).toFixed(2);

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
             <CompressOptions
               level={compressionLevel}
               onLevelChange={setCompressionLevel}
             />
             <div className="flex justify-center">
                <Button size="lg" onClick={handleProcess} className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-red-500 hover:bg-red-600 text-white">
                    Compress PDF
                </Button>
             </div>
          </div>
        )}

        {status === 'processing' && <ToolProcessor />}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-green-800">Compression Complete!</h3>
                <p className="text-gray-600">Original Size: <strong>{sizeToMB(originalSize)} MB</strong></p>
                <p className="text-gray-600">New Size: <strong>{sizeToMB(compressedSize)} MB</strong></p>
                <p className="font-bold text-green-600">
                    Reduced by {originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(0) : 0}%
                </p>
            </div>
            <ToolDownloader
              downloadUrl={downloadUrl}
              filename={processedFileName}
              onStartOver={handleStartOver}
            />
          </div>
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

export default CompressPDFPage;
