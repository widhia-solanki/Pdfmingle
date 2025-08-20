import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { NextSeo, FAQPageJsonLd } from 'next-seo';

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger';
import { PageArranger } from '@/components/tools/PageArranger';
import { Button } from '@/components/ui/button';

import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';

import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type ToolPageStatus = 'idle' | 'arranging' | 'processing' | 'success' | 'error';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  
  const [status, setStatus] = useState<ToolPageStatus>('idle');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
    if (tool.value === 'merge-pdf' || tool.value === 'organize-pdf') {
      setStatus('arranging');
    } else {
        handleProcess(files);
    }
  };

  const handleProcess = async (filesToProcess = selectedFiles) => {
    if (filesToProcess.length === 0) {
      setError('Please select at least one file to process.');
      return;
    }
    setError(null);
    setStatus('processing');

    try {
      let resultBlob: Blob;
      let filename = 'result.pdf';

      switch (tool.value) {
        case 'merge-pdf':
          const mergedBytes = await mergePDFs(filesToProcess);
          resultBlob = new Blob([mergedBytes], { type: 'application/pdf' });
          filename = 'merged.pdf';
          break;
        case 'split-pdf':
          resultBlob = await splitPDF(filesToProcess[0]);
          const originalName = filesToProcess[0].name.replace(/\.pdf$/i, '');
          filename = `${originalName}_split.zip`;
          break;
        default:
          await new Promise(resolve => setTimeout(resolve, 3000));
          const response = await fetch('/sample-output.pdf');
          resultBlob = await response.blob();
          filename = 'processed.pdf';
          break;
      }

      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setDownloadFilename(filename);
      setStatus('success');

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };
  
  const handleStartOver = () => {
    setSelectedFiles([]);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  };

  if (router.isFallback || !tool) return <NotFoundPage />;
  
  const Icon = iconMap[tool.icon] || FileQuestion;

  const renderContent = () => {
    switch (status) {
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={downloadFilename} />;
      case 'error': return (
        <div className="text-center text-red-500 font-semibold p-8">
          <p>Error: {error}</p>
          <Button onClick={handleStartOver} variant="outline" className="mt-4">Try Again</Button>
        </div>
      );
      
      case 'arranging':
        // --- THIS IS THE CRITICAL LOGIC ---
        // Show the FileArranger for merging multiple files
        if (tool.value === 'merge-pdf') {
            return (
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-4">Arrange Your Files</h2>
                    <p className="text-gray-600 mb-6">Drag and drop to set the order of your PDFs before merging.</p>
                    <FileArranger files={selectedFiles} onFilesChange={setSelectedFiles} onRemoveFile={(index) => {
                        const newFiles = [...selectedFiles];
                        newFiles.splice(index, 1);
                        setSelectedFiles(newFiles);
                        if (newFiles.length === 0) setStatus('idle');
                    }} />
                    <div className="mt-8 flex justify-center gap-4">
                        <Button variant="outline" size="lg" onClick={() => setStatus('idle')}>Add More Files</Button>
                        <Button size="lg" onClick={() => handleProcess(selectedFiles)} className="bg-red-500 hover:bg-red-600">Merge PDFs</Button>
                    </div>
                </div>
            );
        }
        // Show the PageArranger for organizing a single file's pages
        if (tool.value === 'organize-pdf') {
            return (
                <div className="w-full">
                    <h2 className="text-2xl font-bold mb-4">Arrange Your Pages</h2>
                    <p className="text-gray-600 mb-6">Drag and drop to reorder the pages within your PDF.</p>
                    <PageArranger files={selectedFiles} onArrangementChange={setPageOrder} />
                    <div className="mt-8 flex justify-center gap-4">
                        <Button variant="outline" size="lg" onClick={handleStartOver}>Back</Button>
                        <Button size="lg" onClick={() => handleProcess(selectedFiles)} className="bg-red-500 hover:bg-red-600">Organize PDF</Button>
                    </div>
                </div>
            );
        }
        // Fallback for any other case
        return null;

      default:
        return (
          <ToolUploader
            onFilesSelected={handleFilesSelected}
            onProcess={() => handleProcess(selectedFiles)}
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            actionButtonText={`Select Files`}
            selectedFiles={selectedFiles}
            isMultiFile={tool.isMultiFile}
            error={error}
          />
        );
    }
  };

  return (
    <>
      <NextSeo /* ... */ />
      <FAQPageJsonLd /* ... */ />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div /* ... */> <Icon /* ... */ /> </div>
        <h1 /* ... */>{tool.h1}</h1>
        <p /* ... */>{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... */ };

export default ToolPage;
