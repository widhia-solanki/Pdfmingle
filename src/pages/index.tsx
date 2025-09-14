// src/pages/index.tsx

import { useState } from 'react';
import { toolArray, categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from '@/components/ToolGrid';
import { FaqSection } from '@/components/FaqSection';
import { cn } from '@/lib/utils';
import { NextSeo, WebPageJsonLd } from 'next-seo';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';
import Image from 'next/image';

const MobileHero = ({ activeCategory, setActiveCategory }: { activeCategory: ToolCategory | 'All', setActiveCategory: (category: ToolCategory | 'All') => void }) => (
    <section className="container mx-auto px-4 py-8 md:py-12">
      {/* The background here is an image, so we focus on text contrast */}
      <div className="bg-hero-bg text-white rounded-2xl p-8 md:p-16 text-center animate-in fade-in duration-500">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200 dark:text-gray-300">
          Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Button
            onClick={() => setActiveCategory('All')}
            className={cn(
              "rounded-full px-6 py-3 text-base font-semibold transition-colors",
              activeCategory === 'All' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
            )}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-6 py-3 text-base font-semibold transition-colors",
                activeCategory === category 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
);

const DesktopHero = () => {
    return (
        // Use theme variables for background color
        <section className="w-full pt-20 md:pt-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-500">
                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                            Every tool you need to work with PDFs in one place
                        </h1>
                        <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground leading-relaxed">
                            Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
                        </p>
                        <div className="mt-10 flex justify-center lg:justify-start">
                            <Button asChild size="lg" className="text-lg px-8 py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                                <Link href="#tools">View All Tools</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-500">
                        <Image
                          src="/hero-illustration-v2.png"
                          alt="Illustration of PDF document management tools"
                          width={600}
                          height={500}
                          priority
                          className="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const isMobile = useIsMobile();

  const filteredTools = (isMobile && activeCategory !== 'All')
    ? toolArray.filter(tool => tool.category === activeCategory)
    : toolArray;

  if (isMobile === undefined) {
    // Use theme variables for the loading screen background
    return <div className="w-full h-screen bg-background" />;
  }

  return (
    <>
      <NextSeo
        title="Free & Secure Online PDF Tools"
        description="Merge, split, compress, convert, and protect your PDF files for free. PDFMingle is the ultimate online suite of tools for all your PDF needs."
        canonical="https://pdfmingle.com"
      />
      <WebPageJsonLd
        name="PDFMingle"
        description="Merge, split, compress, convert, and protect your PDF files for free. PDFMingle is the ultimate online suite of tools for all your PDF needs."
        id="https://pdfmingle.com/#webpage"
        url="https://pdfmingle.com"
      />
      
      {/* Use theme variables for the main page wrapper */}
      <div className="w-full bg-background">
        {isMobile ? (
          <MobileHero activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        ) : (
          <DesktopHero />
        )}
        
        <ToolGrid tools={filteredTools} />
        
        <FaqSection />
      </div>
    </>
  );
};

export default HomePage;
