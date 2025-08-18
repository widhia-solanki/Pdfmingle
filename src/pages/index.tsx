// src/pages/index.tsx

import { useState } from 'react';
import { tools, categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { FaqSection } from '@/components/FaqSection';
import { cn } from '@/lib/utils';
import { NextSeo, WebPageJsonLd } from 'next-seo';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <>
      <NextSeo
        title="Free & Secure Online PDF Tools"
        description="Merge, split, compress, convert, and protect your PDF files for free. PDFMingle is the ultimate online suite of tools for all your PDF needs."
        canonical="https://pdfmingle.net"
      />
      <WebPageJsonLd
        name="PDFMingle"
        description="Merge, split, compress, convert, and protect your PDF files for free. PDFMingle is the ultimate online suite of tools for all your PDF needs."
        id="https://pdfmingle.net/#webpage"
        url="https://pdfmingle.net"
      />
      
      <div className="w-full">
        {/* --- HERO SECTION --- */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="bg-hero-bg text-white rounded-2xl p-8 md:p-16 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
              Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
            </p>
            
            {/* --- FILTER BUTTONS --- */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              <Button
                onClick={() => setActiveCategory('All')}
                className={cn(
                  "rounded-full px-6 py-3 text-base font-semibold transition-colors",
                  activeCategory === 'All' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-700/50 text-white hover:bg-white/20'
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
                      : 'bg-gray-700/50 text-white hover:bg-white/20'
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <ToolGrid tools={filteredTools} />
        <FaqSection />
        <InformativePanel />
      </div>
    </>
  );
};

export default HomePage;
