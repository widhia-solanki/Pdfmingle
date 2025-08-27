// src/pages/crop-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PdfThumbnailViewer } from '@/components/tools/PdfThumbnailViewer';
import { MarginCropControls, CropMode } from '@/components/tools/MarginCropControls';
import { PdfMarginPreviewer } from '@/components/tools/PdfMarginPreviewer';
import { cropPdfWithMargins, MarginState } from '@/lib/pdf/crop';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Crop } from 'lucide-react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

type Status = 'idle' | 'cropping' | 'processing' | 'success' | 'error';
const defaultMargins: MarginState = { top: 0, bottom: 0, left: 0, right: 0, unit: 'px' };

const CropPdfPage: NextPage = () => {
  const tool = tools['crop-pdf'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [margins, setMargins] = useState<{ [key: number]: MarginState }>({});
  const [cropMode, setCropMode] = useState<CropMode>('all');
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      handleStartOver();
      setFile(selectedFile);
      try {
        const fileBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        setPageCount(pdf.numPages);
        setStatus('cropping');
      } catch (e) {
        setError("Could not read PDF. It may be corrupt or password-protected.");
        setStatus('error');
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const pdfBytes = await cropPdfWithMargins(file, margins, cropMode, currentPage);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`cropped_${file.name}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been cropped.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Crop failed: ${message}`);
      setStatus('error');
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setPageCount(0);
    setCurrentPage(0);
    setMargins({});
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }, [downloadUrl]);

  const handleMarginChange = (newMargins: MarginState) => {
    if (cropMode === 'all') {
      const newAllMargins: { [key: number]: MarginState } = {};
      for (let i = 0; i < pageCount; i++) {
        newAllMargins[i] = newMargins;
      }
      setMargins(newAllMargins);
    } else {
      setMargins(prev => ({ ...prev, [currentPage]: newMargins }));
    }
  };

  const handleReset = () => {
    if (cropMode === 'all') {
      const newAllMargins: { [key: number]: MarginState } = {};
      for (let i = 0; i < pageCount; i++) {
        newAllMargins[i] = defaultMargins;
      }
      setMargins(newAllMargins);
    } else {
      setMargins(prev => ({ ...prev, [currentPage]: defaultMargins }));
    }
  };

  const currentMargins = margins[currentPage] || defaultMargins;

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.com/${tool.value}`}
      />
      <main className="w-full">
        {status === 'idle' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader onFilesSelected={handleFileSelected} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} selectedFiles={file ? [file] : []} isMultiFile={false} error={error} onProcess={() => {}} actionButtonText={tool.label} />
          </div>
        )}

        {status === 'cropping' && file && (
          <div className="flex w-full h-[calc(100vh-5rem)]">
            <div className="w-64 flex-shrink-0 h-full border-r bg-gray-50 shadow-md">
              <PdfThumbnailViewer file={file} currentPage={currentPage} onPageChange={setCurrentPage} pageCount={pageCount} />
            </div>
            <div className="flex-grow h-full flex items-center justify-center bg-gray-400 p-4 overflow-auto">
              <PdfMarginPreviewer file={file} pageIndex={currentPage} margins={currentMargins} onDimensionsChange={setPageDimensions} />
            </div>
            <div className="w-80 flex-shrink-0 bg-gray-50 p-6 flex flex-col shadow-lg border-l">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Crop PDF</h2>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                  <p>Adjust the margins to select the area you want to keep.</p>
                </div>
                <MarginCropControls 
                  mode={cropMode} 
                  onModeChange={setCropMode} 
                  onReset={handleReset}
                  margins={currentMargins}
                  onMarginsChange={handleMarginChange}
                  pageDimensions={pageDimensions}
                />
              </div>
              <Button size="lg" onClick={handleProcess} className="w-full bg-brand-blue hover:bg-brand-blue-dark font-bold py-6 text-lg">
                <Crop className="mr-2 h-5 w-5"/>
                Crop PDF
              </Button>
            </div>
          </div>
        )}

        {status === 'processing' && <div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>}
        {status === 'success' && <div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} /></div>}
        {status === 'error' && <div className="text-center p-8"><p className="text-red-500 font-semibold mb-4">{error}</p><Button onClick={handleStartOver} variant="outline">Try Again</Button></div>}
      </main>
    </>
  );
};

export default CropPdfPage;
