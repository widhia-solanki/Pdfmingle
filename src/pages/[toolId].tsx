// src/pages/[toolId].tsx

import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Import all our components
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger';
import { PageArranger } from '@/components/tools/PageArranger';
import { SplitOptions, SplitRange } from '@/components/tools/SplitOptions';
import { CompressOptions, CompressionLevel } from '@/components/tools/CompressOptions';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';

// Import our REAL PDF utility functions
import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';
import { compressPDF } from '@/lib/pdf/compress';

import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type ToolPageStatus = 'idle' | 'options' | 'arranging' | 'processing' | 'success' | 'error';

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
  
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([{ from: 1, to: 1 }]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');

  useEffect(() => {
    if (status === 'options' && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const reader = new FileReader();
      setPdfDoc(null);

      reader.onload = async (e) => {
        if (!e.target?.result) {
          setError("Failed to read file buffer.");
          setStatus('error');
          return;
        }
        try {
          const pdfJS = await import('pdfjs-dist');
          pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;
          const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
          const loadedPdfDoc = await pdfJS.getDocument(typedArray).promise;
          
          setPdfDoc(loadedPdfDoc);
          setTotalPages(loadedPdfDoc.numPages);
          if (tool.value === 'split-pdf') {
            setSplitRanges([{ from: 1, to: loadedPdfDoc.numPages }]);
          }
        } catch (err) {
          setError("Could not read the PDF. It may be corrupt or password-protected.");
          setStatus('error');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [status, selectedFiles, tool.value]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
    if (tool.value === 'split-pdf' || tool.value === 'organize-pdf' || tool.value === 'compress-pdf') {
      setStatus('options');
    } else if (tool.value === 'merge-pdf') {
      setStatus('arranging');
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    setError(null);
    setStatus('processing');

    try {
      let resultBlob: Blob;
      let filename: string;
      const originalName = selectedFiles[0].name.replace(/\.pdf$/i, '');

      switch (tool.value) {
        case 'merge-pdf':
          const mergedBytes = await mergePDFs(selectedFiles);
          resultBlob = new Blob([mergedBytes], { type: 'application/pdf' });
          filename = 'merged.pdf';
          break;
        case 'split-pdf':
          resultBlob = await splitPDF(selectedFiles[0], splitRanges);
          filename = `${originalName}_split.zip`;
          break;
        case 'compress-pdf':
          const compressedBytes = await compressPDF(selectedFiles[0], compressionLevel);
          resultBlob = new Blob([compressedBytes], { type: 'application/pdf' });
          filename = `${originalName}_compressed.pdf`;
          break;
        default:
          await new Promise(resolve => setTimeout(resolve, 2000));
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
        <div className="text-center p-8">
            <p className="text-red-500 font-semibold mb-4">Error: {error}</p>
            <Button onClick={handleStartOver} variant="outline">Try Again</Button>
        </div>
      );
      
      // --- THIS IS THE FIX: The correct UI is now included ---
      case 'arranging':
        if (tool.value === 'merge-pdf') {
          return (
            <div className="w-full">
                <h2 className="text-2xl font-bold mb-4">Arrange Your Files</h2>
                <p className="text-gray-600 mb-6">Set the order of your PDFs before merging.</p>
                <FileArranger files={selectedFiles} onFilesChange={setSelectedFiles} onRemoveFile={(index) => {
                    const newFiles = [...selectedFiles];
                    newFiles.splice(index, 1);
                    setSelectedFiles(newFiles);
                    if (newFiles.length === 0) setStatus('idle');
                }} />
                <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={() => setStatus('idle')}>Add More Files</Button>
                    <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600">Merge PDFs</Button>
                </div>
            </div>
          );
        }
        return null;

      case 'options':
        if (selectedFiles.length > 0) {
            return (
                <div className="w-full grid md:grid-cols-2 gap-8 items-start">
                    <div className="md:sticky md:top-24">
                        <h2 className="text-2xl font-bold mb-4">File Preview</h2>
                        <PDFPreviewer pdfDoc={pdfDoc} />
                    </div>
                    <div>
                        {tool.value === 'split-pdf' && (
                            <SplitOptions totalPages={totalPages} ranges={splitRanges} onRangesChange={setSplitRanges} />
                        )}
                        {tool.value === 'compress-pdf' && (
                            <CompressOptions level={compressionLevel} onLevelChange={setCompressionLevel} />
                        )}
                        {tool.value === 'organize-pdf' && (
                             <PageArranger files={selectedFiles} onArrangementChange={setPageOrder} />
                        )}
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600" disabled={!pdfDoc && (tool.value === 'split-pdf' || tool.value === 'compress-pdf')}>
                                {tool.label}
                            </Button>
                            <Button variant="outline" onClick={handleStartOver} className="w-full">Choose a different file</Button>
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
            onProcess={handleProcess}
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            actionButtonText={tool.label}
            selectedFiles={selectedFiles}
            isMultiFile={tool.isMultiFile}
            error={error}
          />
        );
    }
  };

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`https://pdfmingle.net/${tool.value}`}
      />
      <FAQPageJsonLd
        mainEntity={tool.faqs.map(faq => ({
          questionName: faq.question,
          acceptedAnswerText: faq.answer,
        }))}
      />
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
          <Icon className={`h-10 w-10`} style={{ color: tool.color }} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = tools.map(tool => ({
        params: { toolId: tool.value },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const tool = tools.find(t => t.value === params?.toolId);
    if (!tool) {
        return { notFound: true };
    }
    return { props: { tool } };
};

export default ToolPage;
