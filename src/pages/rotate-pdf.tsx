// src/pages/rotate-pdf.tsx

import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { rotatePdf } from '@/lib/pdf/rotate';
import { tools } from '@/constants/tools';
import PDFPreviewer from '@/components/PDFPreviewer';

type Status = 'idle' | 'arranging' | 'processing' | 'success';

const RotatePDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [rotations, setRotations] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const tool = tools['rotate-pdf'];
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setStatus('arranging');
  };

  const handleRotate = (index: number) => {
    setRotations((prev) => {
      const currentRotation = prev[index] || 0;
      const newRotation = (currentRotation + 90) % 360;
      return { ...prev, [index]: newRotation };
    });
  };

  const handleFileRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (newFiles.length === 0) {
        setStatus('idle');
    }
    setRotations((prev) => {
      const newRotations = { ...prev };
      delete newRotations[index];
      return Object.keys(newRotations).reduce((acc, key) => {
        const numKey = parseInt(key, 10);
        if (numKey > index) {
          acc[numKey - 1] = newRotations[numKey];
        } else if (numKey < index) {
          acc[numKey] = newRotations[numKey];
        }
        return acc;
      }, {} as { [key: number]: number });
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload a PDF file to rotate.');
      return;
    }
    setStatus('processing');
    try {
      setError(null);
      const processed = await rotatePdf(files[0], rotations);
      setProcessedFile(new Blob([processed], { type: 'application/pdf' }));
      setStatus('success');
    } catch (err) {
      setError('An error occurred while rotating the PDF.');
      console.error(err);
      setStatus('arranging');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedFile(null);
    setRotations({});
    setError(null);
    setStatus('idle');
  };

  return (
    <>
      <Head>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.description} />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">{tool.h1}</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          {tool.description}
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

        {status === 'arranging' && (
             <div className="w-full max-w-4xl mx-auto space-y-6">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file, index) => (
                    <PDFPreviewer
                      key={index}
                      file={file}
                      index={index}
                      onRemove={handleFileRemove}
                      onRotate={handleRotate}
                      rotationAngle={rotations[index] || 0}
                    />
                  ))}
                </div>
                <ToolProcessor
                  onProcess={handleProcess}
                  buttonText="Rotate PDF"
                  isProcessing={false}
                />
              </div>
        )}

        {status === 'processing' && (
            <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold animate-pulse">Rotating your PDF...</p>
             </div>
        )}
        
        {status === 'success' && processedFile && (
          <ToolDownloader
            processedFile={processedFile}
            fileName={`rotated_${files[0]?.name || 'document.pdf'}`}
            onReset={handleReset}
          />
        )}
      </div>
    </>
  );
};

export default RotatePDFPage;
