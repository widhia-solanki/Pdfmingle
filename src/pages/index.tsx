import { useState } from 'react';
import { ToolGrid } from '@/components/ToolGrid';
import Head from 'next/head';
import { categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HomePage = () => {
  // --- NEW: State is now managed by the homepage ---
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  return (
    <>
      <Head>
        <title>PDFMingle – Free Online PDF Tools | Merge, Convert, Edit & More</title>
        <meta 
          name="description" 
          content="Work with PDFs easily using PDFMingle. Merge, convert, edit, compress, split, and secure files online. Fast, free, and secure — no sign-up required." 
        />
      </Head>
      <div className="container mx-auto px-4 text-center">
        {/* Hero Section */}
        <div className="py-10 md:py-16">
          {/* --- UPDATED: The dark card now contains the filter buttons --- */}
          <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Every tool you need to work with PDFs in one place
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
            </p>
            
            {/* --- NEW: Filter buttons are now inside the hero section --- */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-8">
              <Button
                onClick={() => setActiveCategory('All')}
                className={cn(
                  "rounded-full px-5 py-2 text-base md:text-sm transition-colors",
                  activeCategory === 'All' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                )}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full px-5 py-2 text-base md:text-sm transition-colors",
                    activeCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* --- UPDATED: Pass the active category to the ToolGrid --- */}
        <ToolGrid activeCategory={activeCategory} />
      </div>
    </>
  );
};

export default HomePage;
