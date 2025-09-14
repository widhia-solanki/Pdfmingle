// src/pages/split-pdf.tsx

import { useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { SplitOptions, SplitRange, SplitMode } from '@/components/tools/SplitOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { splitPDF } from '@/lib/pdf/split';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type SplitStatus = 'idle' | 'options' | 'processing' | 'success' | 'error';

const SplitPdfPage = () => {
  const [status, setStatus] = useState<SplitStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [totalPages, setTotalPages] = useState(0);
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([{ from: 1, to: 1 }]);
  const [splitMode, setSplitMode] = useState<SplitMode>('ranges');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setTotalPages(0);
    setSplitRanges([{ from: 1, to: 1 }]);
  }, [downloadUrl]);

  const handleFileSelected = async (files: File[]) => {
    setError(null); // Clear previous errors
    if (files.length === 0) {
      handleStartOver();
      return;
    }
    
    const selectedFile = files[0];
    setFile(selectedFile);

    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      
      setTotalPages(pdf.numPages);
      setSplitRanges([{ from: 1, to: pdf.numPages }]);
      setStatus('options');
    } catch (err: any) {
      setError("Could not read the PDF. It may be corrupt or password-protected.");
      setStatus('idle'); // Revert to idle to show the uploader with the error
      setFile(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const resultBlob = await splitPDF(file, splitRanges, splitMode);
      setProcessedFileName(`${file.name.replace(/\.pdf$/i, '')}_split.zip`);
      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };

  return (
    <>
      <NextSeo
        title="Split PDF Online – Extract Pages Free"
        description="Separate PDF pages or extract sections easily. Free, secure, and fast PDF splitter."
      />
      <div className="flex flex-col items-center text-center pt-20">
        // AFTER
<h1 className="text-4xl font-bold text-foreground">Split PDF</h1>
<p className="mt-4 text-lg text-muted-foreground">Separate PDF pages...</p>
        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
            {/* --- THIS IS THE FIX --- */}
            {/* Uploader is now shown for both 'idle' and 'error' states */}
            {(status === 'idle' || status === 'error') && (
                <div className="flex flex-col items-center gap-4">
                    <ToolUploader 
                        onFilesSelected={handleFileSelected}
                        acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                        selectedFiles={file ? [file] : []}
                        isMultiFile={false}
                        error={error}
                        onProcess={() => {}}
                        actionButtonText=""
                    />
                    {status === 'error' && <Button onClick={handleStartOver} variant="outline">Try Again</Button>}
                </div>
            )}
            {status === 'options' && file && (
                <div className="w-full grid md:grid-cols-2 gap-8 items-start">
                    <div className="md:sticky md:top-24">
                        <h2 className="text-2xl font-bold mb-4">File Preview</h2>
                        <PDFPreviewer file={file} onRemove={handleStartOver} index={0} />
                    </div>
                    <div>
                        <SplitOptions 
                            totalPages={totalPages} 
                            ranges={splitRanges} 
                            onRangesChange={setSplitRanges} 
                            mode={splitMode}
                            onModeChange={setSplitMode}
                        />
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <Button size="lg" onClick={handleProcess} className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white">Split PDF</Button>
                            <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
                        </div>
                    </div>
                </div>
            )}
            {status === 'processing' && <ToolProcessor />}
            {status === 'success' && (
                <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} />
            )}
        </div>
      </div>
    </>
  );
};

export default SplitPdfPage;
