// src/pages/[toolId].tsx

import { useState, useEffect, useCallback } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import { FileArranger } from '@/components/tools/FileArranger';
import { SplitOptions, SplitRange } from '@/components/tools/SplitOptions';
import { CompressOptions, CompressionLevel } from '@/components/tools/CompressOptions';
import { PageRotator } from '@/components/tools/PageRotator'; // <-- New Component
import { PDFPreviewer } from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';
import { compressPDF } from '@/lib/pdf/compress';
import { rotatePDF } from '@/lib/pdf/rotate';
import { FileQuestion } from 'lucide-react';

type ToolPageStatus = 'idle' | 'loading_preview' | 'options' | 'arranging' | 'processing' | 'success' | 'error';
interface PageRotation { [pageIndex: number]: number; }

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
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [pageRotations, setPageRotations] = useState<PageRotation>({});

  // ... (handleStartOver and useEffect hooks remain the same)

  const handleFilesSelected = async (files: File[]) => {
    // ... (logic for merge, split, compress remains the same)
    const needsPreview = ['split-pdf', 'compress-pdf', 'organize-pdf', 'rotate-pdf'].includes(tool.value);
    
    if (needsPreview && files.length > 0) {
        setStatus('loading_preview');
        // ... (loadPdfForPreview logic remains the same)
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
          /* ... merge logic ... */
          break;
        case 'split-pdf':
          /* ... split logic ... */
          break;
        case 'compress-pdf':
          /* ... compress logic ... */
          break;
        case 'rotate-pdf':
          const rotatedBytes = await rotatePDF(selectedFiles[0], pageRotations);
          resultBlob = new Blob([rotatedBytes], { type: 'application/pdf' });
          filename = `${originalName}_rotated.pdf`;
          break;
        default:
          /* ... default mock logic ... */
          break;
      }

      // ... (rest of handleProcess logic remains the same)
    } catch (err: any) {
      /* ... error handling ... */
    }
  };
  
  // ... (rest of the component structure, getStaticPaths, getStaticProps)

  const renderContent = () => {
    switch (status) {
      case 'processing': return <ToolProcessor />;
      case 'success': return <ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={downloadFilename} />;
      case 'error': return ( /* ... error UI ... */ );
      case 'loading_preview': return ( /* ... loading UI ... */ );
      case 'arranging': return ( /* ... FileArranger for Merge ... */ );
      
      case 'options':
        if (tool.value === 'rotate-pdf') {
          return (
            <div className="w-full">
              <PageRotator pdfDoc={pdfDoc} onRotationsChange={setPageRotations} />
              <div className="mt-8 flex justify-center gap-4">
                  <Button variant="outline" size="lg" onClick={handleStartOver}>Back</Button>
                  <Button size="lg" onClick={handleProcess} className="bg-red-500 hover:bg-red-600" disabled={!pdfDoc}>
                      Rotate PDF
                  </Button>
              </div>
            </div>
          );
        }
        // ... (other options for split, compress, organize)
        return (/* ... other options UI ... */);

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
      <NextSeo /* ... */ />
      <div className="flex flex-col items-center text-center pt-8 md-pt-12">
        {/* ... (header section) ... */}
        <div className="mt-8 md:mt-12 w-full max-w-6xl px-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

// ... (getStaticPaths and getStaticProps)
