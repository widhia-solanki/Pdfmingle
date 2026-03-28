// src/pages/merge-pdf.tsx

import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger';
import { Button } from '@/components/ui/button';
import { mergePDFs } from '@/lib/pdf/merge';

type MergeStatus = 'idle' | 'arranging' | 'processing' | 'success' | 'error';

const MergePdfPage = () => {
  const [status, setStatus] = useState<MergeStatus>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleStartOver = useCallback(() => {
    setFiles([]);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }, [downloadUrl]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setStatus('arranging');
  };

  const handleProcess = async () => {
    if (files.length < 2) {
      setError("Please select at least two files to merge.");
      return;
    }
    setStatus('processing');
    setError(null);

    try {
      const mergedBytes = await mergePDFs(files);
      const resultBlob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setProcessedFileName('merged.pdf');
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  return (
    <>
      <NextSeo
        title="Merge PDF Online – Free & Secure"
        description="Combine multiple PDF files into one instantly. Fast, free, and secure online PDF merger."
      />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        {/* THE FIX: Use semantic theme colors for high contrast */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Merge PDF Online</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Combine multiple PDF files into one instantly. Fast, free, and secure online PDF merger.</p>
        
        <div className="mt-8 md:mt-12 w-full max-w-3xl px-4">
          {status === 'idle' && (
            <ToolUploader
                onFilesSelected={handleFilesSelected}
                isMultiFile={true}
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                selectedFiles={files}
                error={error}
                onProcess={() => {}}
                actionButtonText=""
            />
          )}

          {status === 'arranging' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Arrange Your Files</h2>
              <p className="text-muted-foreground mb-6">Drag and drop to reorder your files before merging.</p>
              <FileArranger files={files} onFilesChange={setFiles} />
              <div className="mt-8 flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setStatus('idle')}>Add More Files</Button>
                <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600 text-white">Merge PDFs</Button>
              </div>
            </div>
          )}

          {status === 'processing' && <ToolProcessor />}
          {status === 'success' && (
            <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} />
          )}
          {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <Button onClick={handleStartOver} variant="outline">Try Again</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MergePdfPage;
