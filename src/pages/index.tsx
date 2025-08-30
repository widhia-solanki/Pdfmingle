// src/pages/index.tsx

import { useState } from 'react';
import { toolArray, categories, ToolCategory, iconMap } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from '@/components/ToolGrid';
import { FaqSection } from '@/components/FaqSection';
import { cn } from '@/lib/utils';
import { NextSeo, WebPageJsonLd } from 'next-seo';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

// --- Mobile Hero (Unchanged) ---
const MobileHero = ({ activeCategory, setActiveCategory }: { activeCategory: ToolCategory | 'All', setActiveCategory: (category: ToolCategory | 'All') => void }) => (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="bg-hero-bg text-white rounded-2xl p-8 md:p-16 text-center animate-in fade-in duration-500">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
          Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Button
            onClick={() => setActiveCategory('All')}
            className={cn(
              "rounded-full px-6 py-3 text-base font-semibold transition-colors",
              activeCategory === 'All' 
                ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' 
                : 'bg-filter-inactive-bg text-white hover:bg-white/20'
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
                  ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' 
                  : 'bg-filter-inactive-bg text-white hover:bg-white/20'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
);

// --- Desktop Hero (Unchanged) ---
const DesktopHero = () => {
    const featuredTools = toolArray.slice(0, 8);
    return (
        <section className="w-full py-20 md:py-28 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left animate-in fade-in slide-in-from-left-12 duration-500">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                            Every tool you need to work with PDFs in one place
                        </h1>
                        <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-gray-600 leading-relaxed">
                            Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
                        </p>
                        <div className="mt-8 flex justify-center md:justify-start">
                            <Button asChild size="lg" className="text-lg px-8 py-6 bg-brand-blue hover:bg-brand-blue-dark text-white">
                                <Link href="#tools">View All Tools</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="animate-in fade-in slide-in-from-right-12 duration-500">
                        <div className="grid grid-cols-4 gap-4">
                            {featuredTools.map((tool) => {
                                const Icon = iconMap[tool.icon];
                                return (
                                    <Link 
                                        href={`/${tool.value}`}
                                        key={tool.value} 
                                        className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl shadow-md border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100/70 mb-3">
                                            <Icon className="h-7 w-7 text-brand-blue" />
                                        </div>
                                        <p className="text-xs font-semibold text-gray-700">{tool.label}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- HomePage Logic (Corrected) ---
const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const isMobile = useIsMobile();

  const filteredTools = activeCategory === 'All'
    ? toolArray
    : toolArray.filter(tool => tool.category === activeCategory);

  if (isMobile === undefined) {
    return <div className="w-full h-screen bg-gray-50" />;
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
      
      <div className="w-full">
        {isMobile ? (
          <MobileHero activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        ) : (
          <DesktopHero />
        )}
        
        {/* --- THIS IS THE FIX --- */}
        {/* The ToolGrid is now rendered for ALL users, after the hero section. */}
        <ToolGrid tools={filteredTools} />
        
        <FaqSection />
      </div>
    </>
  );
};

export default HomePage;
