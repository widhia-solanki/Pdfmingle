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

const CompressPDFPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFile, setProcessedFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>('medium');

  const tool = tools['compress-pdf'];

  const handleFileRemove = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please upload at least one PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const pdfBytes = await compressPDF(files[0], compressionLevel);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedFile(blob);
    } catch (err) {
      setError('An error occurred during compression. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedFile(null);
    setError(null);
    setIsProcessing(false);
  };

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
          <div className="space-y-6 max-w-4xl mx-auto">
            <ToolUploader
              onFilesSelected={setFiles}
              accept={{ 'application/pdf': ['.pdf'] }}
              disabled={files.length > 0}
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  buttonText={
                    isProcessing ? 'Compressing...' : 'Compress PDF'
                  }
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>
        ) : (
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
