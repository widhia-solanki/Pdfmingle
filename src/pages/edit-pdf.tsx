// src/pages/edit-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PdfEditor } from '@/components/tools/PdfEditor';
import { EditorToolbar, EditMode } from '@/components/tools/EditorToolbar';
import { PdfThumbnailViewer } from '@/components/tools/PdfThumbnailViewer';
import { applyEditsToPdf, TextObject } from '@/lib/pdf/edit';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { useToast } from '@/hooks/use-toast';

type Status = 'idle' | 'editing' | 'processing' | 'success' | 'error';

const EditPdfPage: NextPage = () => {
  const tool = tools['edit-pdf'];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [editorKey, setEditorKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [editMode, setEditMode] = useState<EditMode>('select');
  const [selectedObject, setSelectedObject] = useState<TextObject | null>(null); // NEW: Track selected object
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      // Fully reset the state for the new file
      handleStartOver(false); 
      setFile(files[0]);
      setEditorKey(prevKey => prevKey + 1);
      setStatus('editing');
    }
  };
  
  const handleObjectChange = (updatedObject: TextObject) => {
    const newObjects = textObjects.map(obj => obj.id === updatedObject.id ? updatedObject : obj);
    setTextObjects(newObjects);
    setSelectedObject(updatedObject);
  };
  
  const handleObjectDelete = () => {
      if (!selectedObject) return;
      setTextObjects(textObjects.filter(obj => obj.id !== selectedObject.id));
      setSelectedObject(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing');
    try {
      const pdfBytes = await applyEditsToPdf(file, textObjects);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`edited_${file.name}`);
      setStatus('success');
      toast({ title: 'Success!', description: 'Your PDF has been saved.' });
    } catch (err) {
      setError('An error occurred while saving your PDF.');
      setStatus('error');
    }
  };
  
  const handleStartOver = useCallback((resetFile = true) => {
    if(resetFile) setFile(null);
    setStatus('idle');
    setTextObjects([]);
    setCurrentPage(0);
    setEditMode('select');
    setSelectedObject(null);
    setEditorKey(prevKey => prevKey + 1);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.net/${tool.value}`}
      />
      <main className="w-full">
        {status === 'idle' && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader
              onFilesSelected={handleFileSelected}
              acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
              selectedFiles={file ? [file] : []}
              isMultiFile={false}
              error={error}
              onProcess={() => {}}
              actionButtonText="Edit PDF"
            />
          </div>
        )}

        {status === 'editing' && file && (
          <div className="fixed inset-0 top-20 flex flex-col bg-gray-200">
            <div className="flex-shrink-0 p-3 bg-white border-b">
                <EditorToolbar 
                    mode={editMode} 
                    onModeChange={setEditMode} 
                    selectedObject={selectedObject}
                    onObjectChange={handleObjectChange}
                    onObjectDelete={handleObjectDelete}
                />
            </div>
            
            <div className="flex-grow flex overflow-hidden">
                <div className="w-48 flex-shrink-0 h-full">
                    <PdfThumbnailViewer 
                        file={file} 
                        currentPage={currentPage} 
                        onPageChange={(index) => {
                          setCurrentPage(index);
                          setSelectedObject(null); // Deselect object when changing page
                        }} 
                    />
                </div>
                <div className="flex-grow h-full overflow-auto p-4 md:p-8 flex justify-center">
                    <PdfEditor 
                        key={`${editorKey}-${currentPage}`}
                        file={file}
                        pageIndex={currentPage}
                        textObjects={textObjects}
                        onTextObjectsChange={setTextObjects}
                        mode={editMode}
                        onObjectSelect={setSelectedObject}
                    />
                </div>
                <div className="w-72 flex-shrink-0 bg-white p-6 border-l flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Edit PDF</h2>
                    <p className="text-gray-600">Click an item to select it. Click 'T' to add new text.</p>
                  </div>
                  <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 font-bold py-6">
                    Save Changes
                  </Button>
                </div>
            </div>
          </div>
        )}

        {status === 'processing' && (<div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>)}
        {status === 'success' && (<div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={() => handleStartOver(true)} filename={processedFileName} /></div>)}
        {status === 'error' && (
           <div className="text-center p-8">
             <p className="text-red-500 font-semibold mb-4">{error}</p>
             <Button onClick={() => handleStartOver(true)} variant="outline">Try Again</Button>
           </div>
        )}
      </main>
    </>
  );
};

export default EditPdfPage;
