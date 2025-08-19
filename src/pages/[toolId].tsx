// src/pages/[toolId].tsx

import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import NotFoundPage from '@/pages/404';
import { FileQuestion } from 'lucide-react';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';

type ToolPageStatus = 'idle' | 'processing' | 'success';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  
  // --- FIX #1: State is now an array to handle multiple files ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ToolPageStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setError(null);
  };

  const handleProcess = () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to process.');
      return;
    }
    setError(null);
    setStatus('processing');
    
    setTimeout(() => {
      setStatus('success');
    }, 3000);
  };

  const handleStartOver = () => {
    setSelectedFiles([]);
    setStatus('idle');
    setError(null);
  };

  if (router.isFallback || !tool) {
    return <NotFoundPage />;
  }

  const Icon = iconMap[tool.icon] || FileQuestion;
  const canonicalUrl = `https://pdfmingle.net/${tool.value}`;

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return <ToolProcessor />;
      case 'success':
        return <ToolDownloader downloadUrl="/sample-output.pdf" onStartOver={handleStartOver} />;
      default:
        const actionButtonText = tool.label.includes("PDF") ? `Process ${tool.label}` : `${tool.label} PDF`;
        return (
          <ToolUploader
            onFilesSelected={handleFilesSelected}
            onProcess={handleProcess}
            acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
            actionButtonText={actionButtonText}
            // --- FIX #2: Pass the plural 'selectedFiles' prop ---
            selectedFiles={selectedFiles}
            isMultiFile={tool.isMultiFile}
            error={error}
          />
        );
    }
  };

  return (
    <>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={canonicalUrl}
        openGraph={{
          title: tool.metaTitle,
          description: tool.metaDescription,
          url: canonicalUrl,
          images: [{ url: `https://pdfmingle.net/og-image.png`, width: 1200, height: 630, alt: tool.label }],
        }}
      />
      
      <FAQPageJsonLd
        mainEntity={tool.faqs.map(faq => ({
          questionName: faq.question,
          acceptedAnswerText: faq.answer,
        }))}
      />

      <div className="flex flex-col items-center text-center pt-8 md:pt-12">
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100`}>
           <Icon className={`h-10 w-10`} style={{ color: tool.color }} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>
        
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
                {tool.faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base text-gray-600 leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
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
  return { props: { tool } };
};

export default ToolPage;
