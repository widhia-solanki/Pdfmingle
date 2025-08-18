// src/pages/[toolId].tsx

import { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { tools, Tool, iconMap } from '@/constants/tools';
import { PDFProcessor } from '@/components/PDFProcessor';
import { ResultsPage } from '@/components/ResultsPage';
import { useToast } from '@/hooks/use-toast';
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from '@/lib/pdf-tools';
import NotFoundPage from '@/pages/404';
import { FileQuestion } from 'lucide-react';
import { NextSeo, FAQPageJsonLd } from 'next-seo'; // Import FAQPageJsonLd
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  // ... (your existing state and handlers logic)
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('download');

  const Icon = iconMap[tool.icon] || FileQuestion;
  const canonicalUrl = `https://pdfmingle.net/${tool.value}`;

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
      
      {/* Add the FAQ structured data */}
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
        {/* This is your one, unique H1 tag */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{tool.h1}</h1>
        <p className="mt-4 max-w-xl text-base md:text-lg text-gray-600">{tool.description}</p>

        {/* ... (Your existing file processor and results logic) ... */}
        
        <section className="text-left max-w-3xl mx-auto mt-16 md:mt-24 px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">How to {tool.label}</h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-600">
            {tool.steps.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        {/* --- THIS IS THE NEW FAQ SECTION --- */}
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
          {/* ... (Your existing "Try other tools" section) ... */}
        </section>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... */ };

export default ToolPage;
