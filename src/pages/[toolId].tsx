import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
// Import the iconMap we created in tools.ts
import { tools, Tool, iconMap } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from '@/lib/pdf-tools';
import NotFoundPage from '@/pages/404';
import { FileQuestion } from 'lucide-react';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('download');

  // Reset state when the tool changes
  useEffect(() => {
    handleStartOver();
  }, [tool.value]);

  const handleStartOver = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setFiles([]);
    setStatus('idle');
    setDownloadUrl(null);
    setProcessedFileName('download');
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    // The file name state should now include the extension
    a.download = processedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    if (!tool.isBrowserOnly) {
      toast({
        title: "Coming Soon!",
        description: `The "${tool.label}" tool is currently under development.`,
        variant: "default"
      });
      setFiles([]);
      return;
    }

    setStatus("processing");
    try {
      let blob: Blob;
      let outputName = tool.value;
      let outputExtension = 'pdf'; // Default to pdf

      switch (tool.value) {
        case 'merge-pdf':
          blob = await mergePDFs(files);
          outputName = 'merged';
          break;
        case 'split-pdf':
          if (files.length > 1) throw new Error("Please select only one file to split.");
          blob = await splitPDF(files[0]);
          outputName = `${files[0].name.replace('.pdf', '')}_split`;
          outputExtension = 'zip'; // Split tool outputs a zip file
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
          throw new Error("This tool is not yet implemented.");
      }

      const finalFileName = `${outputName}.${outputExtension}`;
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(finalFileName); // Set the full file name with extension
      setStatus("success");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      setFiles([]);
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  // Automatically start processing when files are selected
  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      handleProcess();
    }
  }, [files, status]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!tool) {
    return <NotFoundPage />;
  }

  // --- THIS IS THE FIX ---
  // Look up the icon component from the map using the string name
  // Provide a fallback icon in case it's not found
  const Icon = iconMap[tool.icon] || FileQuestion;

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.label,
    "description": tool.description,
    "applicationCategory": "Productivity",
    "operatingSystem": "Any (Web-based)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.metaDescription} />
        <meta name="keywords" content={tool.metaKeywords} />
        <link rel="canonical" href={`https://www.pdfmingle.net/${tool.value}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
           <Icon className={`h-10 w-10`} style={{ color: tool.color }} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>

        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
          {status === 'success' ? (
            <ResultsPage
              downloadUrl={downloadUrl}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
              fileName={processedFileName} // Pass the full file name
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
  // Now the 'tool' object is fully serializable!
  return { props: { tool } };
};

export default ToolPage;
