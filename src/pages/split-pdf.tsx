// src/pages/split-pdf.tsx

import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { SplitOptions, SplitRange, SplitMode } from '@/components/tools/SplitOptions';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { splitPDF } from '@/lib/pdf/split';

type SplitStatus = 'idle' | 'loading_preview' | 'options' | 'processing' | 'success' | 'error';

const SplitPdfPage = () => {
  const [status, setStatus] = useState<SplitStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([{ from: 1, to: 1 }]);
  // --- NEW: State for the split mode ---
  const [splitMode, setSplitMode] = useState<SplitMode>('ranges');

  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setPdfDoc(null);
    setSplitMode('ranges'); // Reset mode on start over
  }, [downloadUrl]);

  const handleFileSelected = async (files: File[]) => {
    // ... (logic is the same as before)
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      // --- UPDATED: Pass the splitMode to the processing function ---
      const resultBlob = await splitPDF(file, splitRanges, splitMode);
      const filename = `${file.name.replace(/\.pdf$/i, '')}_split.zip`;
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
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                selectedFiles={file ? [file] : []}
                error={error}
                onProcess={() => {}}
                actionButtonText="Split PDF"
            />
        );
      case 'loading_preview':
        // ... (same as before)
      case 'options':
        return (
          <div className="w-full grid md:grid-cols-2 gap-8 items-start">
            <div className="md:sticky md:top-24">
              <h2 className="text-2xl font-bold mb-4">File Preview</h2>
              <PDFPreviewer pdfDoc={pdfDoc} />
            </div>
            <div>
              {/* --- UPDATED: Pass mode props to the options component --- */}
              <SplitOptions 
                totalPages={totalPages} 
                ranges={splitRanges} 
                onRangesChange={setSplitRanges} 
                mode={splitMode}
                onModeChange={setSplitMode}
              />
              <div className="mt-6 flex flex-col items-center gap-4">
                <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600" disabled={!pdfDoc}>
                  Split PDF
                </Button>
                <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
              </div>
            </div>
          </div>
        );
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename="split.zip" />;
      case 'error': return ( /* ... same as before */ );
    }
  };

  return (
    <>
      <NextSeo /* ... */ />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <h1 /* ... */>Split PDF Online</h1>
        <p /* ... */>Separate PDF pages or extract sections easily. Free, secure, and fast PDF splitter.</p>
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SplitPdfPage;
