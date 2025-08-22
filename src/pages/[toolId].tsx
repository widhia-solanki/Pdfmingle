// src/pages/[toolId].tsx

import { useState, useEffect, useCallback } from 'react';
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
import { PageRotator, PageRotation } from '@/components/tools/PageRotator';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import our REAL PDF utility functions
import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';
import { compressPDF } from '@/lib/pdf/compress';
import { rotatePDF } from '@/lib/pdf/rotate';
import { FileQuestion } from 'lucide-react';

type ToolPageStatus = 'idle' | 'loading_preview' | 'options' | 'arranging' | 'processing' | 'success' | 'error';

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
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [pageRotations, setPageRotations] = useState<PageRotation>({});
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  // --- THIS IS THE FIX: The full handleStartOver function is restored ---
  const handleStartOver = useCallback(() => {
    setSelectedFiles([]);
    setStatus('idle');
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
    setPdfDoc(null);
  }, [downloadUrl]);

  useEffect(() => {
    handleStartOver();
  }, [tool.value, handleStartOver]);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) { handleStartOver(); return; }
    setSelectedFiles(files);
    setError(null);
    
    const needsPreview = ['split-pdf', 'compress-pdf', 'organize-pdf', 'rotate-pdf'].includes(tool.value);
    
    if (tool.value === 'merge-pdf') {
        setStatus('arranging');
    } else if (needsPreview) {
        setStatus('loading_preview');
        try {
            const file = files[0];
            const pdfJS = await import('pdfjs-dist');
            pdfJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJS.version}/pdf.worker.min.js`;
            const fileBuffer = await file.arrayBuffer();
            const typedArray = new Uint8Array(fileBuffer);
            const loadedPdfDoc = await pdfJS.getDocument(typedArray).promise;

            setPdfDoc(loadedPdfDoc);
            setTotalPages(loadedPdfDoc.numPages);
            if (tool.value === 'split-pdf') {
                setSplitRanges([{ from: 1, to: loadedPdfDoc.numPages }]);
            }
            setStatus('options');
        } catch (err) {
            setError("Could not read the PDF. It may be corrupt or password-protected.");
            setStatus('error');
        }
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    setStatus('processing');
    setError(null);

    try {
      let resultBlob: Blob;
      let filename: string;
      const originalName = selectedFiles[0]?.name.replace(/\.pdf$/i, '') || 'file';

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
        case 'rotate-pdf':
          const rotatedBytes = await rotatePDF(selectedFiles[0], pageRotations);
          resultBlob = new Blob([rotatedBytes], { type: 'application/pdf' });
          filename = `${originalName}_rotated.pdf`;
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
      case 'loading_preview':
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
                <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
                <p className="text-lg font-semibold text-gray-700">Reading your PDF...</p>
            </div>
        );
      case 'arranging':
        return (
            <div className="w-full max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Arrange Your Files</h2>
                <FileArranger files={selectedFiles} onFilesChange={setSelectedFiles} />
                <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={() => { setSelectedFiles([]); setStatus('idle'); }}>Add More Files</Button>
                    <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600">Merge PDFs</Button>
                </div>
            </div>
        );
      case 'options':
        return (
            <div className="w-full">
                {tool.value === 'rotate-pdf' ? (
                    <PageRotator pdfDoc={pdfDoc} onRotationsChange={setPageRotations} />
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="md:sticky md:top-24">
                            <h2 className="text-2xl font-bold mb-4">File Preview</h2>
                            <PDFPreviewer pdfDoc={pdfDoc} />
                        </div>
                        <div>
                            {tool.value === 'split-pdf' && <SplitOptions totalPages={totalPages} ranges={splitRanges} onRangesChange={setSplitRanges} />}
                            {tool.value === 'compress-pdf' && <CompressOptions level={compressionLevel} onLevelChange={setCompressionLevel} />}
                            {tool.value === 'organize-pdf' && <PageArranger files={selectedFiles} onArrangementChange={setPageOrder} />}
                        </div>
                    </div>
                )}
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600" disabled={!pdfDoc}>
                        {tool.label}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleStartOver}>Choose a different file</Button>
                </div>
            </div>
        );
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
    const paths = tools.map(tool => ({ params: { toolId: tool.value } }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const tool = tools.find(t => t.value === params?.toolId);
    if (!tool) { return { notFound: true }; }
    return { props: { tool } };
};

export default ToolPage;
