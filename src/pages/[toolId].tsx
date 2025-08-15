import { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from "next/router";
import { tools, Tool } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from '@/lib/pdf-tools';
import NotFoundPage from '@/pages/404';

interface ToolPageProps {
  tool: Tool;
}

const BROWSER_ONLY_TOOLS = ["merge-pdf", "split-pdf", "rotate-pdf", "jpg-to-pdf", "add-page-numbers"];

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  const { toolId } = router.query;
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
  }, [toolId]);

  const handleStartOver = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `pdfmingle_${toolId}_result.${toolId === 'split-pdf' || toolId === 'pdf-to-jpg' ? 'zip' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId as string);

    try {
      let blob: Blob;

      if (!requiresBackend) {
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
      } else {
        switch (toolId) {
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

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  if (!toolId || !tool) {
    return <NotFoundPage />;
  }

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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = tools.map((tool) => ({
    params: { toolId: tool.value },
  }));
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
