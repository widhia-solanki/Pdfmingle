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
    <section className="w-full">
      
      {/* --- NEW FILTER SECTION --- */}
      {/* This section now lives inside the ToolGrid component */}
      <div className="w-full bg-white py-12 md:py-16 -mt-16 relative z-20 rounded-t-3xl shadow-lg">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => setActiveCategory('All')}
            variant={activeCategory === 'All' ? 'default' : 'outline'}
            className={cn(
              "rounded-full border-2 px-6 py-3 text-base font-semibold transition-colors",
              activeCategory === 'All' 
                ? 'bg-ilovepdf-button-bg text-ilovepdf-button-text border-ilovepdf-button-bg' 
                : 'bg-white text-ilovepdf-text border-gray-300 hover:bg-gray-100'
            )}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? 'default' : 'outline'}
               className={cn(
                "rounded-full border-2 px-6 py-3 text-base font-semibold transition-colors",
                activeCategory === category 
                  ? 'bg-ilovepdf-button-bg text-ilovepdf-button-text border-ilovepdf-button-bg' 
                  : 'bg-white text-ilovepdf-text border-gray-300 hover:bg-gray-100'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* --- TOOLS GRID --- */}
      <div className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link 
                  href={`/${tool.value}`} 
                  key={tool.value} 
                  className="group flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <Icon className={`h-12 w-12 mb-4 ${tool.color}`} />
                  <h3 className="font-bold text-ilovepdf-text text-xl">{tool.label}</h3>
                  <p className="text-sm text-gray-600 mt-2 flex-grow">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
