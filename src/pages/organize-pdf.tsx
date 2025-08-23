// src/pages/organize-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PageArranger } from '@/components/tools/PageArranger';
import { organizePdf, PageObject } from '@/lib/pdf/organize';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type Status = 'idle' | 'arranging' | 'processing' | 'success' | 'error';

const OrganizePdfPage: NextPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const loadInitialPages = async (selectedFile: File) => {
    setStatus('arranging'); // Show loading state immediately
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      const initialPages: PageObject[] = Array.from({ length: pdf.numPages }, (_, i) => ({
        id: `page-${i}`,
        originalIndex: i,
        rotation: 0,
      }));
      setPages(initialPages);
    } catch (err) {
      setError("Could not read the PDF. It may be corrupt or password-protected.");
      setStatus('error');
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      loadInitialPages(selectedFiles[0]);
    } else {
      setFile(null);
      setStatus('idle');
    }
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setPages([]);
    setError(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessedFileName('');
  }, [downloadUrl]);

  const handleProcess = async () => {
    if (!file || pages.length === 0) {
      setError("No pages to organize.");
      return;
    }
    setStatus('processing');
    try {
      const processed = await organizePdf(file, pages);
      const blob = new Blob([processed], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`organized_${file.name}`);
      setStatus('success');
    } catch (err) {
      setError('An error occurred while organizing the PDF.');
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Organize PDF Pages - Free Online Tool</title>
        <meta name="description" content="Reorder, arrange, rotate, and delete PDF pages effortlessly. Free and secure." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Organize PDF Pages</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Drag and drop to reorder pages. Use the buttons on each page to rotate or delete.
        </p>
        
        {status === 'idle' && (
            <div className="max-w-4xl mx-auto">
                <ToolUploader 
                    onFilesSelected={handleFilesSelected}
                    acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                    selectedFiles={file ? [file] : []}
                    isMultiFile={false}
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
            </div>
        )}

        {status === 'arranging' && file && (
             <div className="w-full max-w-7xl mx-auto space-y-6 flex flex-col items-center">
                <PageArranger file={file} pages={pages} onPagesChange={setPages} />
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600 text-white px-12 py-6">
                        Organize PDF
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleStartOver}>
                        Start Over
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

export default OrganizePdfPage;
