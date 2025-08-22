// src/pages/compress-pdf.tsx

import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { CompressOptions, CompressionLevel } from '@/components/tools/CompressOptions';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { compressPDF } from '@/lib/pdf/compress';

type CompressStatus = 'idle' | 'loading_preview' | 'options' | 'processing' | 'success' | 'error';

const CompressPdfPage = () => {
  const [status, setStatus] = useState<CompressStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');

  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setPdfDoc(null);
    setCompressionLevel('medium');
  }, [downloadUrl]);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) {
      handleStartOver();
      return;
    }
    
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
      let errorMessage = "Could not read the PDF. It may be corrupt.";
      if (err.name === 'PasswordException') {
        errorMessage = "This PDF is password-protected and cannot be processed.";
      }
      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const compressedBytes = await compressPDF(file, compressionLevel);
      const resultBlob = new Blob([compressedBytes], { type: 'application/pdf' });
      const filename = `${file.name.replace(/\.pdf$/i, '')}_compressed.pdf`;
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
        return (
            <ToolUploader 
                onFilesSelected={handleFileSelected} 
                isMultiFile={false}
                // --- THIS IS THE FIX: Added all required props ---
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                selectedFiles={file ? [file] : []}
                error={error}
                onProcess={handleProcess}
                actionButtonText="Compress PDF"
            />
        );
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
              <CompressOptions level={compressionLevel} onLevelChange={setCompressionLevel} />
              <div className="mt-6 flex flex-col items-center gap-4">
                <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600" disabled={!pdfDoc}>
                  Compress PDF
                </Button>
                <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
              </div>
            </div>
          </div>
        );
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={file?.name.replace(/\.pdf$/i, '_compressed.pdf') || 'compressed.pdf'} />;
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
        title="Compress PDF Online – Reduce File Size"
        description="Shrink PDF file size without losing quality. Quick, secure, and free online PDF compressor."
      />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Compress PDF Online</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Shrink PDF file size without losing quality. Quick, secure, and free online PDF compressor.</p>
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default CompressPdfPage;
