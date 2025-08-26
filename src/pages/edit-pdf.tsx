// src/pages/edit-pdf.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import * as pdfjsLib from 'pdfjs-dist';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { AdvancedEditorToolbar, MainMode, ToolMode } from '@/components/tools/AdvancedEditorToolbar';
import { PdfThumbnailViewer } from '@/components/tools/PdfThumbnailViewer';
import { PdfEditor } from '@/components/tools/PdfEditor';
import { ZoomControls } from '@/components/tools/ZoomControls';
import { applyEditsToPdf, EditableObject, TextObject, ImageObject } from '@/lib/pdf/edit';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react'; // Import the loader

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

type Status = 'idle' | 'editing' | 'processing' | 'success' | 'error';

const EditPdfPage: NextPage = () => {
  const tool = tools['edit-pdf'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [mainMode, setMainMode] = useState<MainMode>('edit');
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1.0);

  const [objects, setObjects] = useState<EditableObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<EditableObject | null>(null);
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      handleStartOver(false);
      setFile(selectedFile);
      setStatus('editing'); // Go to editing status to show a loading state

      try {
        const fileBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        setPageCount(pdf.numPages); // This will trigger the editor to render
      } catch (e) {
        setError("Could not read PDF. It may be corrupt or password-protected.");
        setStatus('error');
      }
    }
  };
  
  const handleObjectChange = (updatedObject: EditableObject) => {
    const newObjects = objects.map(obj => obj.id === updatedObject.id ? updatedObject : obj);
    setObjects(newObjects);
    setSelectedObject(updatedObject);
  };
  
  const handleObjectDelete = () => {
      if (!selectedObject) return;
      setObjects(objects.filter(obj => obj.id !== selectedObject.id));
      setSelectedObject(null);
  };

  const handleImageAdd = async (imageFile: File) => {
    const imageBytes = await imageFile.arrayBuffer();
    const newImage: ImageObject = {
      type: 'image', id: `image-${Date.now()}`, x: 50, y: 50,
      pageIndex: currentPage, imageBytes, width: 200 * zoom, height: 150 * zoom,
    };
    setObjects([...objects, newImage]);
    setSelectedObject(newImage);
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const pdfBytes = await applyEditsToPdf(file, objects, zoom);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`edited_${file.name}`);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Save failed: ${message}`);
      setStatus('error');
    }
  };
  
  const handleStartOver = useCallback((resetFile = true) => {
    if(resetFile) setFile(null);
    setStatus('idle');
    setObjects([]);
    setPageCount(0);
    setCurrentPage(0);
    setMainMode('edit');
    setToolMode('select');
    setSelectedObject(null);
    setZoom(1.0);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  return (
    <>
      <NextSeo title={tool.metaTitle} description={tool.metaDescription} canonical={`https://pdfmingle.net/${tool.value}`} />
      <main className="w-full">
        {status === 'idle' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader onFilesSelected={handleFileSelected} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} selectedFiles={file ? [file] : []} isMultiFile={false} error={error} onProcess={() => {}} actionButtonText="Edit PDF" />
          </div>
        )}
        {status === 'editing' && file && (
          // --- THIS IS THE FIX ---
          // We now check if pageCount is ready before rendering the editor.
          // While it's loading, we show a clean loading screen.
          pageCount > 0 ? (
            <div className="fixed inset-0 top-20 flex flex-col bg-gray-200">
              <AdvancedEditorToolbar mainMode={mainMode} onMainModeChange={setMainMode} toolMode={toolMode} onToolModeChange={setToolMode} selectedObject={selectedObject} onObjectChange={handleObjectChange} onObjectDelete={handleObjectDelete} onImageAdd={handleImageAdd} />
              <div className="flex-grow flex overflow-hidden relative">
                <div className="w-48 flex-shrink-0 h-full">
                  <PdfThumbnailViewer file={file} currentPage={currentPage} onPageChange={setCurrentPage} pageCount={pageCount} />
                </div>
                <div className="flex-grow h-full overflow-auto p-4 md:p-8 flex justify-center">
                  <PdfEditor 
                      key={`${file.name}-${currentPage}`}
                      file={file}
                      pageIndex={currentPage}
                      objects={objects}
                      onObjectsChange={setObjects}
                      mode={toolMode}
                      onObjectSelect={setSelectedObject}
                      zoom={zoom}
                  />
                </div>
                <div className="w-72 flex-shrink-0 bg-white p-6 border-l flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Edit PDF</h2>
                    <p className="text-gray-600">Use the toolbar to add text, images, and shapes. Click an object to select, move, or resize it.</p>
                  </div>
                  <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 font-bold py-6">Save Changes</Button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                  <ZoomControls zoom={zoom} onZoomChange={setZoom} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center h-[70vh]">
              <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
              <p className="text-lg font-semibold text-gray-600">Preparing your document...</p>
            </div>
          )
        )}
        {status === 'processing' && (<div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>)}
        {status === 'success' && (<div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={() => handleStartOver(true)} filename={processedFileName} /></div>)}
        {status === 'error' && (<div className="text-center p-8"><p className="text-red-500 font-semibold mb-4">{error}</p><Button onClick={() => handleStartOver(true)} variant="outline">Try Again</Button></div>)}
      </main>
    </>
  );
};

export default EditPdfPage;
