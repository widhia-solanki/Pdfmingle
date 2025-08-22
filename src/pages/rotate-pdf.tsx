// src/pages/rotate-pdf.tsx

import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { RotateOptions, RotationDirection } from '@/components/tools/RotateOptions';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { rotatePDF } from '@/lib/pdf/rotate';

type RotateStatus = 'idle' | 'loading_preview' | 'options' | 'processing' | 'success' | 'error';

const RotatePdfPage = () => {
  const [status, setStatus] = useState<RotateStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [rotationDirection, setRotationDirection] = useState<RotationDirection>('right');

  // --- THIS IS THE FIX: The full handleStartOver function is restored ---
  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setPdfDoc(null);
  }, [downloadUrl]);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);
    setStatus('loading_preview');

    try {
      const pdfJS = await import('pdfjs-dist');
      pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.mjs`;
      const fileBuffer = await selectedFile.arrayBuffer();
      const typedArray = new Uint8Array(fileBuffer);
      const loadedPdfDoc = await pdfJS.getDocument({ data: typedArray }).promise;
      setPdfDoc(loadedPdfDoc);
      setStatus('options');
    } catch (err: any) {
      setError("Could not read the PDF. It may be corrupt or password-protected.");
      setStatus('error');
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const rotatedBytes = await rotatePDF(file, rotationDirection);
      const resultBlob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const filename = `${file.name.replace(/\.pdf$/i, '')}_rotated.pdf`;
      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <ToolUploader onFilesSelected={handleFileSelected} isMultiFile={false} />;
      case 'loading_preview':
        return (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-700">Reading your PDF...</p>
          </div>
        );
      case 'options':
        return (
          <div className="w-full grid md:grid-cols-2 gap-8 items-start">
            <div className="md:sticky md:top-24">
              <h2 className="text-2xl font-bold mb-4">File Preview</h2>
              <PDFPreviewer pdfDoc={pdfDoc} />
            </div>
            <div>
              <RotateOptions selectedDirection={rotationDirection} onRotateDirectionSelect={setRotationDirection} />
              <div className="mt-6 flex flex-col items-center gap-4">
                <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600" disabled={!pdfDoc}>
                  Rotate PDF
                </Button>
                <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
              </div>
            </div>
          </div>
        );
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={file?.name.replace(/\.pdf$/i, '_rotated.pdf') || 'rotated.pdf'} />;
      case 'error': return (
        <div className="text-center p-8">
            <p className="text-red-500 font-semibold mb-4">Error: {error}</p>
            <Button onClick={handleStartOver} variant="outline">Try Again</Button>
        </div>
      );
    }
  };

  return (
    <>
      <NextSeo
        title="Rotate PDF Pages – Free Online Tool"
        description="Rotate and flip PDF pages easily. Free, secure, and simple to use online tool."
      />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Rotate PDF</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Rotate all pages in your document exactly as you need.</p>
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default RotatePdfPage;
