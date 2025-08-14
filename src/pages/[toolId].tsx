import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { tools, Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF } from '@/lib/pdf-tools';

interface ToolPageProps {
  tool: Tool;
}

const BROWSER_ONLY_TOOLS = ["merge-pdf", "split-pdf"];

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const { toast } = useToast();

  // --- START OF THE FIX ---
  // All the state management for the tool is now correctly placed here
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    handleStartOver();
  }, [tool.value]);

  const handleStartOver = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfmingle_${tool.value}_result.${tool.value === 'split-pdf' ? 'zip' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please select at least one file to process.", variant: "destructive" });
      return;
    }

    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(tool.value);

    try {
      let blob: Blob;

      if (!requiresBackend) {
        if (tool.value === 'merge-pdf') {
          blob = await mergePDFs(files);
        } else if (tool.value === 'split-pdf') {
          if (files.length > 1) throw new Error("Please select only one file to split.");
          blob = await splitPDF(files[0]);
        } else {
          throw new Error("Tool not implemented for browser processing.");
        }
      } else {
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${tool.value}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      toast({ title: "Success!", description: "Your files have been processed." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };
  // --- END OF THE FIX ---

  const schema = {
    // ... schema content is unchanged
  };

  return (
    <>
      <Head>
        {/* ... Head content is unchanged ... */}
      </Head>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-xl text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          {/* Now we decide which component to show and pass the correct props */}
          {status === 'success' ? (
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
            />
          ) : (
            <PDFProcessor
              files={files}
              onFilesChange={setFiles}
              onProcess={handleProcess}
              status={status as "idle" | "processing"}
              selectedTool={tool.value}
              onToolChange={() => {}}
              hideToolSelector={true}
            />
          )}
        </div>
        
        {/* ... rest of the page content is unchanged ... */}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = tools.map((tool) => ({
    params: { toolId: tool.value },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tool = tools.find(t => t.value === params?.toolId);
  if (!tool) return { notFound: true };
  return { props: { tool } };
};

export default ToolPage;
