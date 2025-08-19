import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { FileQuestion } from 'lucide-react';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Import the NEW reusable tool components ---
import { ToolUploader } from '@/components/tools/ToolUploader';
import { ToolProcessor } from '@/components/tools/ToolProcessor';
import { ToolDownloader } from '@/components/tools/ToolDownloader';

type ToolPageStatus = 'idle' | 'processing' | 'success';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  
  // --- This is the new, simplified state for the mock workflow ---
  const [status, setStatus] = useState<ToolPageStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    // Only allow one file for this mock version
    setSelectedFile(files[0] || null);
    setError(null); // Clear previous errors
  };

  const handleProcess = () => {
    if (!selectedFile) {
      setError('Please select a file to process.');
      return;
    }
    setError(null);
    setStatus('processing');
    
    // Mock processing delay (3-5 seconds)
    setTimeout(() => {
      setStatus('success');
    }, Math.random() * 2000 + 3000);
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setStatus('idle');
    setError(null);
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  if (!tool) {
    return <NotFoundPage />;
  }

  const Icon = iconMap[tool.icon] || FileQuestion;
  const canonicalUrl = `https://pdfmingle.net/${tool.value}`;

  // --- This function renders the correct component based on the current status ---
  const renderContent = () => {
    switch (status) {
      case 'processing':
        return <ToolProcessor />;
      case 'success':
        // The download URL points to the dummy file in your /public folder
        return <ToolDownloader downloadUrl="/sample-output.pdf" onStartOver={handleStartOver} />;
      case 'idle':
      default:
        // For the mock, we will use a generic action button text
        const actionButtonText = tool.label.includes("PDF") ? `Process ${tool.label}` : `${tool.label} PDF`;
        return (
          <ToolUploader
            onFilesSelected={handleFilesSelected}
            onProcess={handleProcess}
            // For this mock, we will accept any PDF file for any tool
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            actionButtonText={actionButtonText}
            selectedFile={selectedFile}
            error={error}
          />
        );
    }
  };

  return (
    <>
      <NextSeo /* ... your SEO tags ... */ />
      <FAQPageJsonLd /* ... your FAQ schema ... */ />

      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
           <Icon className={`h-10 w-10`} style={{ color: tool.color }} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>
        
        {/* --- The content area is now powered by our new render function --- */}
        <div className="mt-8 md:mt-12 w-full max-w-4xl px-4">
          {renderContent()}
        </div>

        <section className="text-left max-w-3xl mx-auto mt-16 md:mt-24 px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">How to {tool.label}</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            {tool.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        <section className="w-full max-w-3xl mx-auto mt-16 md:mt-24 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Questions about {tool.label}?</h2>
            <Accordion type="single" collapsible>
                {/* ... your FAQ accordion ... */}
            </Accordion>
        </section>

        <section className="mt-16 text-center w-full px-4">
            {/* ... your "other tools" section ... */}
        </section>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... Unchanged ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... Unchanged ... */ };

export default ToolPage;
