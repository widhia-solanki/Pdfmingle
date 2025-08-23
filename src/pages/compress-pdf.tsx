// src/pages/compress-pdf.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import { tools } from '@/constants/tools';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { CompressOptions, CompressionLevel } from '@/components/tools/CompressOptions';
import PDFPreviewer from '@/components/PDFPreviewer';
import { compressPDF } from '@/lib/pdf/compress';
import { NextPage } from 'next';

type Status = 'idle' | 'arranging' | 'processing' | 'success';

const CompressPDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>('medium');

  const tool = tools['compress-pdf'];

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setStatus('arranging');
  };

  const handleFileRemove = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setStatus('idle');
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload at least one PDF file.');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      const pdfBytes = await compressPDF(files[0], compressionLevel);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedFile(blob);
      setStatus('success');
    } catch (err) {
      setError('An error occurred during compression. Please try again.');
      console.error(err);
      setStatus('arranging'); // Go back to options on error
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedFile(null);
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
                onProcess={() => {}} // Not used in this state
                actionButtonText="" // Not used in this state
            />
           </div>
        )}

        {status === 'arranging' && (
          <div className="space-y-6 max-w-4xl mx-auto">
             {error && <p className="text-red-500 text-center">{error}</p>}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {files.map((file, index) => (
                 <PDFPreviewer
                   key={index}
                   file={file}
                   index={index}
                   onRemove={handleFileRemove}
                 />
               ))}
             </div>
             <CompressOptions
               level={compressionLevel}
               onLevelChange={setCompressionLevel}
             />
             <ToolProcessor
               onProcess={handleProcess}
               buttonText="Compress PDF"
               isProcessing={false}
             />
          </div>
        )}

        {status === 'processing' && (
            <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold animate-pulse">Compressing your file...</p>
             </div>
        )}

        {status === 'success' && processedFile && (
          <ToolDownloader
            processedFile={processedFile}
            fileName={`compressed_${files[0]?.name || 'document.pdf'}`}
            onReset={handleReset}
          />
        )}
      </div>
    </>
  );
};

export default CompressPDFPage;
