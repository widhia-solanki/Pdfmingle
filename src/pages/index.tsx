import { useState } from 'react';
import { tools, categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { cn } from '@/lib/utils';

const HomePage = () => {
  // The state for filtering is now managed directly on the homepage
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="w-full">
      {/* --- NEW HERO SECTION --- */}
      <section className="relative w-full overflow-hidden bg-hero-bg text-white rounded-b-3xl">
        <div className="relative z-10 container mx-auto px-4 text-center pt-20 md:pt-28 pb-12 md:pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
          
          {/* --- FILTER BUTTONS ARE NOW INSIDE THE HERO --- */}
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

      {/* The ToolGrid now only displays the grid, and receives the filtered tools */}
      <ToolGrid tools={filteredTools} />

      <InformativePanel />
    </div>
  );
};

export default HomePage;
