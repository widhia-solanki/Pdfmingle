// src/pages/edit-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import * as pdfjsLib from 'pdfjs-dist';
import dynamic from 'next/dynamic';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { AdvancedEditorToolbar, ToolMode } from '@/components/tools/AdvancedEditorToolbar';
import { PdfEditor, RENDER_SCALE } from '@/components/tools/PdfEditor';
import { BottomControls } from '@/components/tools/BottomControls';
import { applyEditsToPdf, EditableObject, ImageObject } from '@/lib/pdf/edit';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import { buildCanonical } from '@/lib/seo';

// Dynamically import the heavy thumbnail viewer
const PdfThumbnailViewer = dynamic(() => import('@/components/tools/PdfThumbnailViewer').then(mod => mod.PdfThumbnailViewer), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

type Status = 'idle' | 'editing' | 'processing' | 'success' | 'error';

const EditPdfPage: NextPage = () => {
  const tool = tools['edit-pdf'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  
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
      setStatus('editing');
      try {
        const fileBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
        setPageCount(pdf.numPages);
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
  
  const handleObjectDelete = (idToDelete?: string) => {
    const id = idToDelete || selectedObject?.id;
    if (!id) return;
    setObjects(objects.filter(obj => obj.id !== id));
    setSelectedObject(null);
  };

  const handleImageAdd = async (imageFile: File) => {
    const imageBytes = await imageFile.arrayBuffer();
    const newImage: ImageObject = {
      type: 'image', id: `image-${Date.now()}`, x: 50, y: 50,
      pageIndex: currentPage, imageBytes, width: 200, height: 150,
    };
    setObjects([...objects, newImage]);
    setSelectedObject(newImage);
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const pdfBytes = await applyEditsToPdf(file, objects, RENDER_SCALE);
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
    setToolMode('select');
    setSelectedObject(null);
    setZoom(1.0);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  return (
    <>
      <NextSeo title={tool.metaTitle} description={tool.metaDescription} canonical={buildCanonical(`/${tool.value}`)} />
      
        {status === 'idle' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader onFilesSelected={handleFileSelected} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} selectedFiles={file ? [file] : []} isMultiFile={false} error={error} onProcess={() => {}} actionButtonText="Select PDF" />
          </div>
        )}

        {status === 'editing' && file && (
          <div className="fixed top-20 left-0 right-0 bottom-0 flex flex-col bg-gray-200">
            {pageCount > 0 ? (
              <div className="flex w-full h-full">
                <div className="w-64 flex-shrink-0 h-full border-r bg-gray-50 shadow-md">
                  <PdfThumbnailViewer file={file} currentPage={currentPage} onPageChange={setCurrentPage} pageCount={pageCount} />
                </div>

                {/* --- THIS IS THE UPDATED SECTION --- */}
                <div className="flex-grow h-full flex flex-col bg-gray-400 relative">
                  <header className="flex-shrink-0 w-full flex justify-center p-2 bg-white/80 backdrop-blur-sm shadow-sm z-10">
                    <AdvancedEditorToolbar toolMode={toolMode} onToolModeChange={setToolMode} selectedObject={selectedObject} onObjectChange={handleObjectChange} onObjectDelete={() => handleObjectDelete()} onImageAdd={handleImageAdd} />
                  </header>
                  
                  {/* The main preview area now centers the content */}
                  <div className="flex-grow w-full h-full overflow-auto flex items-center justify-center p-4">
                    <div className="m-auto" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
                      <PdfEditor 
                        file={file} pageIndex={currentPage} objects={objects}
                        onObjectsChange={setObjects} mode={toolMode} onObjectSelect={setSelectedObject}
                      />
                    </div>
                  </div>

                  <footer className="flex-shrink-0 w-full flex justify-center p-2 z-10">
                     <BottomControls zoom={zoom} onZoomChange={setZoom} currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
                  </footer>
                </div>
                {/* --- END OF UPDATED SECTION --- */}

                <div className="w-80 flex-shrink-0 bg-gray-50 p-6 flex flex-col shadow-lg border-l">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit PDF</h2>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                    <p>Use the toolbar to modify or add text, upload images, and annotate with ease.</p>
                  </div>
                  <div className="mt-auto">
                    <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 font-bold py-6 text-lg">
                      Apply Changes
                      <Edit className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                <p className="text-lg font-semibold text-gray-600">Preparing your document...</p>
              </div>
            )}
          </div>
        )}

        {status === 'processing' && (<div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>)}
        {status === 'success' && (<div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={() => handleStartOver(true)} filename={processedFileName} /></div>)}
        {status === 'error' && (<div className="text-center p-8"><p className="text-red-500 font-semibold mb-4">{error}</p><Button onClick={() => handleStartOver(true)} variant="outline">Try Again</Button></div>)}
      
    </>
  );
};

export default EditPdfPage;
