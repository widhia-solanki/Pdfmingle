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

const RotatePDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [rotations, setRotations] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const tool = tools['rotate-pdf'];

  const handleRotate = (index: number) => {
    setRotations((prev) => {
      const currentRotation = prev[index] || 0;
      const newRotation = (currentRotation + 90) % 360;
      return { ...prev, [index]: newRotation };
    });
  };

  const handleFileRemove = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
    try {
      setError(null);
      const processed = await rotatePdf(files[0], rotations);
      setProcessedFile(new Blob([processed], { type: 'application/pdf' }));
    } catch (err) {
      setError('An error occurred while rotating the PDF.');
      console.error(err);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedFile(null);
    setRotations({});
    setError(null);
  };
  
  const isUploaderDisabled = files.length > 0;

  return (
    <>
      <Head>
        {/* FIX: Use 'metaTitle' for the page title */}
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.description} />
      </Head>
      <div className="container mx-auto px-4 py-8">
        {/* FIX: Use 'h1' for the main page heading */}
        <h1 className="text-4xl font-bold text-center mb-4">{tool.h1}</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          {tool.description}
        </p>

        {!processedFile ? (
          <div className="space-y-6">
            <ToolUploader 
              onFilesSelected={setFiles} 
              accept={{ 'application/pdf': ['.pdf'] }}
              disabled={isUploaderDisabled}
            />
            
            {error && <p className="text-red-500 text-center">{error}</p>}

            {files.length > 0 && (
              <div className="w-full max-w-4xl mx-auto">
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
                  className="mt-6"
                />
              </div>
            )}
          </div>
        ) : (
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
