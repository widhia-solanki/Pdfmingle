// src/pages/image-to-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const ImageToPdfPage: NextPage = () => {
  const tool = tools['image-to-pdf'];
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    if ([...files, ...selectedFiles].length > 0) {
      setStatus('options');
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image file.');
      return;
    }
    setStatus('processing');
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pdfmingle-backend.onrender.com';
      
      // --- THIS IS THE FIX ---
      // The endpoint in our python app is '/image-to-pdf'.
      // We were calling the old endpoint name from the 'tool.value' which was 'jpg-to-pdf'.
      // This ensures we call the correct, existing backend route.
      const response = await fetch(`${apiBaseUrl}/image-to-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // This is where the original error was happening. 
        // response.json() fails because the server sent back an HTML error page.
        const errorData = await response.json(); 
        throw new Error(errorData.error || 'A server error occurred.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName('converted-images.pdf');
      setStatus('success');
      toast({ title: 'Success!', description: 'Your images have been converted to a PDF.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      // This is the user-friendly error you saw in the screenshot
      if (message.includes('valid JSON')) {
          setError('Could not connect to the conversion service. Please try again later.');
      } else {
          setError(message);
      }
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
        <h1 className="text-4xl font-bold text-foreground">{tool.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {tool.description}
        </p>

        {status === 'idle' && (
           <div className="max-w-4xl mx-auto">
            <ToolUploader
                onFilesSelected={handleFilesSelected}
                acceptedFileTypes={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                selectedFiles={files}
                isMultiFile={true}
                error={error}
                onProcess={() => {}}
                actionButtonText=""
            />
           </div>
        )}

        {status === 'options' && (
          <div className="space-y-8 max-w-4xl mx-auto flex flex-col items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Arrange Your Images</h2>
              <p className="text-gray-600 mb-6">Drag and drop to reorder your images. They will appear in the PDF in this sequence.</p>
              <FileArranger files={files} onFilesChange={setFiles} />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
              <Button size="lg" onClick={handleProcess} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-6">
                Convert to PDF
              </Button>
              <Button variant="outline" size="lg" onClick={() => setStatus('idle')} className="w-full sm:w-auto">
                Add More Images
              </Button>
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

export default ImageToPdfPage;
