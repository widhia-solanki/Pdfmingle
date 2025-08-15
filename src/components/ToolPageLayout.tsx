import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { tools, Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from '@/lib/pdf-tools';

interface ToolPageLayoutProps {
  tool: Tool;
}

const BROWSER_ONLY_TOOLS = ["merge-pdf", "split-pdf", "rotate-pdf", "jpg-to-pdf", "add-page-numbers"];

export const ToolPageLayout = ({ tool }: ToolPageLayoutProps) => {
  const { toast } = useToast();
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      handleProcess();
    }
  }, [files]);

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
      a.download = `pdfmingle_${tool.value}_result.${tool.value === 'split-pdf' || tool.value === 'pdf-to-jpg' ? 'zip' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(tool.value);

    try {
      let blob: Blob;

      if (!requiresBackend) {
        // --- THIS IS THE FIX ---
        // The backend logic was missing, it has been restored.
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${tool.value}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
      } else {
        // Browser-side logic
        switch (tool.value) {
          case 'merge-pdf':
            blob = await mergePDFs(files);
            break;
          case 'split-pdf':
            if (files.length > 1) throw new Error("Please select only one file to split.");
            blob = await splitPDF(files[0]);
            break;
          case 'rotate-pdf':
            blob = await rotatePDF(files[0], 90);
            break;
          case 'jpg-to-pdf':
            blob = await jpgToPDF(files);
            break;
          case 'add-page-numbers':
            blob = await addPageNumbersPDF(files[0]);
            break;
          default:
            throw new Error("Tool not implemented for browser processing.");
        }
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      toast({ title: "Success!", description: "Your files have been processed." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      setFiles([]);
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  const schema = {
    // ... schema is unchanged
  };

  return (
    <>
      <Head>
        {/* ... Head is unchanged ... */}
      </Head>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-xl text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          {status === 'success' ? (
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
            />
          ) : (
            status === 'processing' ? (
              <div className="flex flex-col items-center justify-center p-12">
                <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
              </div>
            ) : (
              <PDFProcessor onFilesSelected={setFiles} />
            )
          )}
        </div>
        
        {/* ... rest of the page is unchanged ... */}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // ... getStaticProps is unchanged
};

export const getStaticPaths: GetStaticPaths = async () => {
  // ... getStaticPaths is unchanged
};

export default ToolPage;
