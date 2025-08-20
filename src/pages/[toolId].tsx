// src/pages/[toolId].tsx

import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { NextSeo, FAQPageJsonLd } from 'next-seo';

// Import all our components
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { SplitOptions, SplitRange } from '@/components/tools/SplitOptions';
import { PDFPreviewer } from '@/components/PDFPreviewer'; // We need this for page count
import { Button } from '@/components/ui/button';

import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';

// ... other imports ...
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type ToolPageStatus = 'idle' | 'options' | 'processing' | 'success' | 'error';

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
  
  // --- NEW STATE FOR SPLIT OPTIONS ---
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([{ from: 1, to: 1 }]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // When a file is selected for the split tool, read its page count
    if (tool.value === 'split-pdf' && selectedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const pdfJS = await import('pdfjs-dist');
          pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;
          const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfJS.getDocument(typedArray).promise;
          setTotalPages(pdf.numPages);
          // Set default range to the full document
          setSplitRanges([{ from: 1, to: pdf.numPages }]);
        } catch (err) {
            setError("Could not read the PDF file.");
        }
      };
      reader.readAsArrayBuffer(selectedFiles[0]);
    }
  }, [selectedFiles, tool.value]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
    // Move to the options state for the split tool
    if (tool.value === 'split-pdf') {
      setStatus('options');
    }
  };

  const handleProcess = async () => {
    // ... (Your handleProcess logic)
  };
  
  const handleStartOver = () => { /* ... unchanged ... */ };

  if (router.isFallback || !tool) return <NotFoundPage />;
  
  const Icon = iconMap[tool.icon] || FileQuestion;

  const renderContent = () => {
    switch (status) {
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={downloadFilename} />;
      case 'error': return ( /* ... unchanged ... */ );
      
      // --- NEW CASE TO RENDER SPLIT OPTIONS ---
      case 'options':
        if (tool.value === 'split-pdf' && selectedFiles.length > 0) {
            return (
                <div className="w-full grid md:grid-cols-2 gap-8 items-start">
                    <div className="md:sticky md:top-24">
                        <h2 className="text-2xl font-bold mb-4">File Preview</h2>
                        <PDFPreviewer file={selectedFiles[0]} />
                    </div>
                    <div>
                        <SplitOptions totalPages={totalPages} ranges={splitRanges} onRangesChange={setSplitRanges} />
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600">Split PDF</Button>
                            <Button variant="outline" onClick={handleStartOver}>Choose a different file</Button>
                        </div>
                    </div>
                </div>
            )
        }
        return null;

      default:
        return (
          <ToolUploader
            onFilesSelected={handleFilesSelected}
            onProcess={handleProcess} // This button will now be hidden for arranger tools
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            actionButtonText={`Select PDF File`}
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
      <div /* ... */>
        <div /* ... */> <Icon /* ... */ /> </div>
        <h1 /* ... */>{tool.h1}</h1>
        <p /* ... */>{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... */ };

export default ToolPage;
