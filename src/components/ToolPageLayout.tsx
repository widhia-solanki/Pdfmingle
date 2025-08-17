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
  // 1. Add state for the processed file name
  const [processedFileName, setProcessedFileName] = useState<string>('download');


  useEffect(() => {
    // Automatically start processing when files are selected
    if (files.length > 0 && status === 'idle') {
      handleProcess();
    }
  }, [files, status]);

  useEffect(() => {
    // Reset state when the tool changes
    handleStartOver();
  }, [tool.value]);

  const handleStartOver = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setFiles([]);
    setStatus('idle');
    setDownloadUrl(null);
    // 4. Reset the file name on start over
    setProcessedFileName('download');
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    // Use the state for the download name
    a.download = processedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(tool.value);

    try {
      let blob: Blob;
      // 2. Variable to hold the output name
      let outputName = tool.value;
      let outputExtension = 'pdf';

      if (requiresBackend) {
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${tool.value}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
        outputName = `${files[0].name.replace(/\.[^/.]+$/, "")}_processed`;
        if (response.headers.get("Content-Type") === 'application/zip') {
          outputExtension = 'zip';
        }
      } else {
        switch (tool.value) {
          case 'merge-pdf':
            blob = await mergePDFs(files);
            outputName = 'merged';
            break;
          case 'split-pdf':
            if (files.length > 1) throw new Error("Please select only one file to split.");
            blob = await splitPDF(files[0]);
            outputName = `${files[0].name.replace('.pdf', '')}_split`;
            outputExtension = 'zip'; // Split produces a zip
            break;
          case 'rotate-pdf':
            if (files.length > 1) throw new Error("Please select only one file to rotate.");
            blob = await rotatePDF(files[0], 90);
            outputName = `${files[0].name.replace('.pdf', '')}_rotated`;
            break;
          case 'jpg-to-pdf':
            blob = await jpgToPDF(files);
            outputName = 'images_converted';
            break;
          case 'add-page-numbers':
            if (files.length > 1) throw new Error("Please select only one file.");
            blob = await addPageNumbersPDF(files[0]);
            outputName = `${files[0].name.replace('.pdf', '')}_numbered`;
            break;
          default:
            throw new Error("This tool is not yet implemented in the browser.");
        }
      }

      const finalFileName = `${outputName}.${outputExtension}`;
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(finalFileName); // Set the full file name
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
           <Icon className={`h-10 w-10`} style={{color: tool.color}} />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>
        
        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
          {status === 'success' ? (
            // 3. Pass the 'fileName' prop
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
              fileName={processedFileName}
            />
          ) : status === 'processing' ? (
            <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed rounded-lg">
                <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
             </div>
          ) : (
            <PDFProcessor onFilesSelected={setFiles} />
          )}
        </div>
        
        <section className="text-left max-w-3xl mx-auto mt-16 md:mt-24 px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">How to {tool.label}</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            {tool.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        <section className="mt-16 text-center w-full px-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Try our other tools:</h3>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {tools.filter(t => t.value !== tool.value).slice(0, 4).map(otherTool => (
                    <Link key={otherTool.value} href={`/${otherTool.value}`} className="text-red-500 hover:underline font-medium">
                        {otherTool.label}
                    </Link>
                ))}
            </div>
        </section>
      </div>
    </>
  );
};
