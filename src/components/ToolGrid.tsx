import { useState } from 'react';
import { tools, categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const ToolGrid = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    // The main container no longer needs margins, as sections handle spacing
    <section className="w-full">
      
      {/* 1. Filter Section with Red Background */}
      <div className="w-full bg-filter-bg bg-cover bg-center py-12 md:py-16">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => setActiveCategory('All')}
            className={cn(
              "rounded-full px-6 py-3 text-base font-semibold transition-colors",
              activeCategory === 'All' 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black/20 text-white hover:bg-black/40'
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
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black/20 text-white hover:bg-black/40'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 2. Tools Section with Yellow Background */}
      <div className="w-full bg-tools-bg bg-cover bg-center py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  href={`/${tool.value}`} 
                  key={tool.value} 
                  className="group flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Icon className={`h-12 w-12 mb-4 ${tool.color}`} />
                  <h3 className="font-bold text-ilovepdf-text text-xl">{tool.label}</h3>
                  <p className="text-sm text-gray-600 mt-2">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
