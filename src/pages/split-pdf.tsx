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

// Set up the worker once when the page loads
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
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
    if (files.length === 0) {
      handleStartOver();
      return;
    }
    
    const selectedFile = files[0];
    setFile(selectedFile);
    setError(null);

    // Use pdf.js to get the page count for the options UI
    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
      setTotalPages(pdf.numPages);
      setSplitRanges([{ from: 1, to: pdf.numPages }]);
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
      // The core logic only needs the file, not the pdf.js doc
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
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Split PDF Online</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Separate PDF pages or extract sections easily. Free, secure, and fast PDF splitter.</p>
        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
            {status === 'idle' && (
                <ToolUploader 
                    onFilesSelected={handleFileSelected}
                    acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                    selectedFiles={file ? [file] : []}
                    isMultiFile={false}
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
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
                            <Button size="lg" onClick={handleProcess} className="w-full">Split PDF</Button>
                            <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
                        </div>
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

export default SplitPdfPage;
