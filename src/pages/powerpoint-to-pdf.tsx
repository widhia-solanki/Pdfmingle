// src/pages/powerpoint-to-pdf.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { tools } from '@/constants/tools';
import { FileSliders, Wrench, ArrowLeft } from 'lucide-react';

const PptToPdfPage: NextPage = () => {
  const tool = tools['powerpoint-to-pdf'];

  return (
    <>
      <NextSeo 
        title={tool.metaTitle} 
        description={tool.metaDescription}
        noindex={true} // It's good practice to noindex construction pages
      />

      <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="flex justify-center items-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse" />
            <FileSliders className="absolute inset-0 m-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <h1 className="mt-8 text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          {tool.h1}
        </h1>

        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          This tool is currently under construction. Our team is working hard to bring this feature to you soon. We appreciate your patience!
        </p>

        {/* Coming Soon Badge */}
        <div className="mt-8 inline-flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 text-sm font-semibold text-yellow-800 dark:text-yellow-200">
          <Wrench className="mr-2 h-4 w-4" />
          Coming Soon
        </div>
        
        <div className="mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Tools
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PptToPdfPage;
