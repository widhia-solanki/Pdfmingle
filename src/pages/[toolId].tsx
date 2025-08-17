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
  const router = useRouter();
  // ... (state and functions remain the same)
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { handleStartOver(); }, [tool?.value]);
  
  const handleStartOver = () => { /* ... */ };
  const handleDownload = () => { /* ... */ };
  const handleProcess = async () => { /* ... */ };
  
  if (!router.isReady) return <div>Loading...</div>;
  if (!tool) return <NotFoundPage />;

  const Icon = tool.icon; // Get the Icon component from the tool data
  const schema = { /* ... */ };

  return (
    <>
      <Head>
        {/* ... (Head is unchanged) ... */}
      </Head>

      {/* --- THIS IS THE FIX --- */}
      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        {/* 1. Added large tool icon */}
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
           <Icon className={`h-10 w-10 ${tool.color}`} />
        </div>

        {/* 2. Added spacing and adjusted text */}
        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          {/* ... (Processing logic is unchanged) ... */}
        </div>
        
        {/* ... (How-to and other tools sections are unchanged) ... */}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... */ };

export default ToolPage;
