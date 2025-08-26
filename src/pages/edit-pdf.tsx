// src/pages/edit-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { PdfEditor } from '@/components/tools/PdfEditor';
import { EditorToolbar, EditMode } from '@/components/tools/EditorToolbar';
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

  // Editor-specific state
  const [currentPage, setCurrentPage] = useState(0); // Show page 1 by default
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [editMode, setEditMode] = useState<EditMode>('select');
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setStatus('editing'); // Go directly to the editor screen
    }
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
  
  const handleStartOver = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setTextObjects([]);
    setCurrentPage(0);
    setEditMode('select');
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.net/${tool.value}`}
      />
      <main className="container mx-auto px-4 py-8">
        {status === 'idle' && (
          <div className="text-center">
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
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold">Edit PDF</h1>
            <EditorToolbar mode={editMode} onModeChange={setEditMode} />
            <div className="w-full max-w-4xl mx-auto">
              <PdfEditor 
                file={file}
                pageIndex={currentPage}
                textObjects={textObjects}
                onTextObjectsChange={setTextObjects}
                mode={editMode}
              />
            </div>
            <div className="flex gap-4">
              <Button size="lg" variant="outline" onClick={handleStartOver}>
                Start Over
              </Button>
              <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600">
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {status === 'processing' && <ToolProcessor />}
        {status === 'success' && <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} />}
        {status === 'error' && (
           <div className="text-center p-8">
             <p className="text-red-500 font-semibold mb-4">{error}</p>
             <Button onClick={handleStartOver} variant="outline">Try Again</Button>
           </div>
        )}
      </main>
    </>
  );
};

export default EditPdfPage;
