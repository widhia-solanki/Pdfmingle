// src/pages/rotate-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PageGrid } from '@/components/tools/PageGrid';
import { rotatePdf } from '@/lib/pdf/rotate';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { RotateCw, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'arranging' | 'processing' | 'success' | 'error';
type RotationMode = 'all' | 'specific';

const RotatePDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const [rotationMode, setRotationMode] = useState<RotationMode>('all');
  const [rotation, setRotation] = useState<number>(0); // For 'all' mode
  const [pageRotations, setPageRotations] = useState<{ [key: number]: number }>({}); // For 'specific' mode
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      handleResetState(); // Clear all options when a new file is uploaded
      setStatus('arranging');
    } else {
      setStatus('idle');
    }
  };

  const handleResetState = () => {
    setError(null);
    setRotationMode('all');
    setRotation(0);
    setPageRotations({});
    setSelectedPages(new Set());
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setStatus('idle');
    handleResetState();
    setDownloadUrl('');
    setProcessedFileName('');
  }, [downloadUrl]);
  
  const handleTogglePageSelection = (pageIndex: number) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageIndex)) {
      newSelection.delete(pageIndex);
    } else {
      newSelection.add(pageIndex);
    }
    setSelectedPages(newSelection);
  };

  const handleRotateSelected = (angle: 90 | -90) => {
    const newRotations = { ...pageRotations };
    selectedPages.forEach(index => {
        const currentAngle = newRotations[index] || 0;
        newRotations[index] = (currentAngle + angle + 360) % 360;
    });
    setPageRotations(newRotations);
  };
  
  const handleSelectAll = (pageCount: number) => {
      const allPages = new Set(Array.from({ length: pageCount }, (_, i) => i));
      setSelectedPages(allPages);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    try {
      const rotationData = rotationMode === 'all' ? rotation : pageRotations;
      const processed = await rotatePdf(files[0], rotationData);
      const blob = new Blob([processed], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`rotated_${files[0]?.name || 'document.pdf'}`);
      setStatus('success');
    } catch (err) {
      setError('An error occurred while rotating the PDF.');
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Rotate PDF Pages – Free Online Tool</title>
        <meta name="description" content="Rotate and flip PDF pages easily. Free, secure, and simple to use online tool." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Rotate PDF Pages – Free Online Tool</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Rotate and flip PDF pages easily. Free, secure, and simple to use online tool.
        </p>
        
        {status === 'idle' && (
            <div className="max-w-4xl mx-auto">
                <ToolUploader 
                    onFilesSelected={handleFilesSelected} 
                    acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                    selectedFiles={files}
                    isMultiFile={false}
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
            </div>
        )}

        {status === 'arranging' && files.length > 0 && (
             <div className="w-full max-w-6xl mx-auto space-y-6 flex flex-col items-center">
                {/* --- Mode Toggle --- */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                    <Button onClick={() => setRotationMode('all')} variant={rotationMode === 'all' ? 'default' : 'ghost'} className={cn(rotationMode === 'all' && 'bg-blue-600 text-white')}>Rotate All Pages</Button>
                    <Button onClick={() => setRotationMode('specific')} variant={rotationMode === 'specific' ? 'default' : 'ghost'} className={cn(rotationMode === 'specific' && 'bg-blue-600 text-white')}>Rotate Specific Pages</Button>
                </div>
                
                {rotationMode === 'all' ? (
                    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 p-6 border rounded-xl bg-white shadow-sm">
                        <PDFPreviewer file={files[0]} index={0} onRemove={handleStartOver} rotationAngle={rotation} />
                        <p className="font-medium">Current Rotation: {rotation}°</p>
                        <Button variant="outline" size="lg" onClick={() => setRotation(prev => (prev + 90) % 360)}>
                            <RotateCw className="mr-2 h-5 w-5"/> Rotate 90°
                        </Button>
                    </div>
                ) : (
                    <div className="w-full p-6 border rounded-xl bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Button onClick={() => handleRotateSelected(90)} variant="outline"><RotateCw className="mr-2 h-4 w-4"/>Rotate 90° CW</Button>
                                <Button onClick={() => handleRotateSelected(-90)} variant="outline"><RotateCw className="mr-2 h-4 w-4 transform -scale-x-100"/>Rotate 90° CCW</Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={() => setSelectedPages(new Set())} variant="ghost"><Square className="mr-2 h-4 w-4"/>Deselect All</Button>
                            </div>
                        </div>
                        <PageGrid file={files[0]} selectedPages={selectedPages} onPageSelect={handleTogglePageSelection} pageRotations={pageRotations} />
                    </div>
                )}
                
                <div className="flex flex-col items-center gap-2">
                    <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600 text-white px-12 py-6">Apply Changes & Download</Button>
                    <Button variant="link" onClick={handleStartOver}>Choose a different file</Button>
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

export default RotatePDFPage;
