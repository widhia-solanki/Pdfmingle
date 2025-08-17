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
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
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
    setStatus('idle');
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

      if (requiresBackend) {
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${tool.value}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
      } else {
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

  const Icon = tool.icon;
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": tool.metaTitle,
    "description": tool.metaDescription,
    "step": tool.steps.map((step, index) => ({
      "@type": "HowToStep",
      "name": `Step ${index + 1}`,
      "text": step,
      "position": index + 1,
    })),
  };

  return (
    <>
      <Head>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.metaDescription} />
        <meta name="keywords" content={tool.metaKeywords} />
        <meta property="og:title" content={tool.metaTitle} />
        <meta property="og:description" content={tool.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.pdfmingle.org/${tool.value}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
           <Icon className={`h-10 w-10 ${tool.color}`} />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-ilovepdf-text">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-muted-foreground">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full">
          {status === 'success' ? (
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
            />
          ) : status === 'processing' ? (
            <div className="flex flex-col items-center justify-center p-12">
                <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
             </div>
          ) : (
            <PDFProcessor onFilesSelected={setFiles} />
          )}
        </div>
        
        <section className="text-left max-w-3xl mx-auto mt-16 md:mt-24">
          <h2 className="text-2xl font-bold text-center mb-6">How to {tool.label}</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            {tool.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        <section className="mt-16 text-center w-full">
            <h3 className="text-xl font-bold mb-4">Try our other tools:</h3>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {tools.filter(t => t.value !== tool.value).slice(0, 4).map(otherTool => (
                    <Link key={otherTool.value} href={`/${otherTool.value}`} className="text-ilovepdf-red hover:underline font-medium">
                        {otherTool.label}
                    </Link>
                ))}
            </div>
        </section>
      </div>
    </>
  );
};
