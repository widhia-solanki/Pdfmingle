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
      {/* --- THIS IS THE FIX --- */}
      {/* The style attribute now uses the correct, full filename. */}
      <div 
        className="bg-gray-800 text-white rounded-2xl p-8 md:p-16 text-center animate-in fade-in duration-500" 
        style={{ backgroundImage: "url('/background for informative panel.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200">
          Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Button
            onClick={() => setActiveCategory('All')}
            className={cn( "rounded-full px-6 py-3 text-base font-semibold transition-colors", activeCategory === 'All' ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' )}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn( "rounded-full px-6 py-3 text-base font-semibold transition-colors", activeCategory === category ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
);

// I am including the rest of the file for completeness, but no changes are needed below this line.
const DesktopHero = ({...}) => { /* ... unchanged ... */ };
const HomePage = ({...}) => { /* ... unchanged ... */ };
export default HomePage;
