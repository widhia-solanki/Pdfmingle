// src/pages/crop-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PdfThumbnailViewer } from '@/components/tools/PdfThumbnailViewer';
import { PdfCropper, CropBox, CROPPER_RENDER_SCALE } from '@/components/tools/PdfCropper';
import { CropOptions, CropMode } from '@/components/tools/CropOptions';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Crop } from 'lucide-react';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type Status = 'idle' | 'cropping' | 'processing' | 'success' | 'error';

const CropPdfPage: NextPage = () => {
  const tool = tools['crop-pdf'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cropBox, setCropBox] = useState<CropBox | undefined>(undefined);
  const [cropMode, setCropMode] = useState<CropMode>('current');
  
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
    if (!file || !cropBox) {
      toast({ title: 'Error', description: 'File or crop area not defined.', variant: 'destructive' });
      return;
    }
    setStatus('processing');
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('x', cropBox.x.toString());
    formData.append('y', cropBox.y.toString());
    formData.append('width', cropBox.width.toString());
    formData.append('height', cropBox.height.toString());
    formData.append('scale', CROPPER_RENDER_SCALE.toString());
    formData.append('mode', cropMode);
    formData.append('pageIndex', currentPage.toString());
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pdfmingle-backend.onrender.com';
      const response = await fetch(`${apiBaseUrl}/api/crop-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'A server error occurred.');
      }

      const blob = await response.blob();
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
    setCropBox(undefined);
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }, [downloadUrl]);

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
            <div className="flex-grow h-full flex flex-col items-center justify-center bg-gray-200 p-8 overflow-auto">
              <PdfCropper file={file} pageIndex={currentPage} onCropChange={setCropBox} initialCropBox={cropBox}/>
            </div>
            <div className="w-80 flex-shrink-0 bg-gray-50 p-6 flex flex-col justify-between shadow-lg border-l">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Crop Options</h2>
                <CropOptions mode={cropMode} onModeChange={setCropMode} currentPage={currentPage} />
              </div>
              <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 font-bold py-6 text-lg">
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
