import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { tools, Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from '@/lib/pdf-tools';
import NotFoundPage from '@/pages/404';

interface ToolPageProps {
  tool: Tool;
}

const BROWSER_ONLY_TOOLS = [ "merge-pdf", "split-pdf", "rotate-pdf", "jpg-to-pdf", "add-page-numbers" ];

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const { toast } = useToast();
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // When files are selected, immediately start processing them.
  useEffect(() => {
    if (files.length > 0) {
      handleProcess();
    }
  }, [files]);

  // Reset state when the user navigates to a new tool page
  useEffect(() => {
    handleStartOver();
  }, [tool.value]);

  const handleStartOver = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    // ... (download logic is unchanged)
  };

  const handleProcess = async () => {
    // ... (processing logic is unchanged)
  };

  const schema = {
    // ... (schema is unchanged)
  };

  return (
    <>
      <Head>
        {/* ... (Head content is unchanged) ... */}
      </Head>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-xl text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          {/* We now decide which view to show: Upload, Processing, or Results */}
          {status === 'success' && (
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
            />
          )}

          {status === 'processing' && (
             <div className="flex flex-col items-center justify-center p-12">
                <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
             </div>
          )}

          {status === 'idle' && (
            <PDFProcessor onFilesSelected={setFiles} />
          )}
        </div>
        
        {/* ... (rest of the page is unchanged) ... */}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = tools.map((tool) => ({ params: { toolId: tool.value } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tool = tools.find(t => t.value === params?.toolId);
  if (!tool) {
    return { notFound: true };
  }
  const { icon, ...serializableTool } = tool;
  return { props: { tool: serializableTool } };
};

export default ToolPage;
