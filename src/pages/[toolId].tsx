// src/pages/[toolId].tsx

import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { NextSeo, FAQPageJsonLd } from 'next-seo';

// Import the correct components
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger'; // <-- Use the new component
import { Button } from '@/components/ui/button';

import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';

// ... other imports ...
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

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
    if (tool.value === 'merge-pdf' || tool.value === 'organize-pdf') {
      setStatus('arranging');
    }
  };

  const handleProcess = async () => {
    // ... (Your handleProcess logic, which now works correctly with the reordered selectedFiles)
  };
  
  const handleStartOver = () => { /* ... unchanged ... */ };

  const onFileOrderChange = (newFiles: File[]) => {
    setSelectedFiles(newFiles);
  };
  
  const onRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    if (newFiles.length === 0) {
        setStatus('idle');
    }
  };

  if (router.isFallback || !tool) { /* ... unchanged ... */ }
  
  const Icon = iconMap[tool.icon] || FileQuestion;

  const renderContent = () => {
    switch (status) {
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={downloadFilename} />;
      case 'error': return ( /* ... unchanged ... */ );
      
      // --- THIS IS THE CORRECTED LOGIC ---
      case 'arranging':
        const actionButtonText = tool.value === 'merge-pdf' ? 'Merge PDFs' : 'Organize Files';
        return (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Arrange Your Files</h2>
            <p className="text-gray-600 mb-6">Set the final order for your documents.</p>
            <FileArranger files={selectedFiles} onFilesChange={onFileOrderChange} onRemoveFile={onRemoveFile} />
            <div className="mt-8 flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setStatus('idle')}>Add More Files</Button>
                <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600">
                    {actionButtonText}
                </Button>
            </div>
          </div>
        );

      default:
        return (
          <ToolUploader
            onFilesSelected={handleFilesSelected}
            onProcess={handleProcess}
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
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>
        
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
