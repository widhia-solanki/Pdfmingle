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

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
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

  const handleDownload = () => { /* ... unchanged ... */ };

  const handleProcess = async () => {
    if (files.length === 0) return;

    // --- THIS IS THE FIX ---
    // If the tool is NOT browser-only, show a "coming soon" message and stop.
    if (!tool.isBrowserOnly) {
      toast({
        title: "Coming Soon!",
        description: `The "${tool.label}" tool is currently under development.`,
      });
      setFiles([]); // Reset files so user can try another tool
      return;
    }
    // --- END OF THE FIX ---

    setStatus("processing");
    try {
      let blob: Blob;

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
          throw new Error("This tool is not yet implemented.");
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      setFiles([]);
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  if (!router.isReady) return <div>Loading...</div>;
  if (!tool) return <NotFoundPage />;

  const Icon = tool.icon;
  const schema = { /* ... unchanged ... */ };

  return (
    <>
      <Head>
        {/* ... Head content is unchanged ... */}
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

export const getStaticPaths: GetStaticPaths = async () => { /* ... unchanged ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... unchanged ... */ };

export default ToolPage;
