import { useState } from 'react';
import { tools, categories, ToolCategory } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const ToolGrid = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <section className="w-full max-w-6xl mx-auto">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
        <Button
          onClick={() => setActiveCategory('All')}
          variant={activeCategory === 'All' ? 'default' : 'outline'}
          className={cn(
            "rounded-full px-5",
            activeCategory === 'All' && 'bg-ilovepdf-text text-white hover:bg-gray-700'
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
              "rounded-full px-5",
               activeCategory === category && 'bg-ilovepdf-text text-white hover:bg-gray-700'
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              to={`/${tool.value}`} 
              key={tool.value} 
              className="group bg-card text-left p-4 rounded-lg shadow-sm border border-transparent hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col items-start"
            >
              {/* This div creates the colored background for the icon */}
              <div className="p-3 rounded-md bg-opacity-10" style={{ backgroundColor: hexToRgba(tool.color, 0.1) }}>
                <Icon className={`h-8 w-8 ${tool.color}`} />
              </div>
              <h3 className="font-semibold text-ilovepdf-text text-lg mt-4">{tool.label}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-grow">{tool.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

// Helper function to convert hex color from Tailwind config to RGBA for the background
const colorMap: { [key: string]: string } = {
  'text-red-500': '#ef4444',
  'text-orange-500': '#f97316',
  'text-green-500': '#22c55e',
  'text-blue-500': '#3b82f6',
  'text-blue-600': '#2563eb',
  'text-purple-500': '#a855f7',
  'text-teal-500': '#14b8a6',
  'text-gray-600': '#4b5563',
};

function hexToRgba(colorClass: string, alpha: number): string {
  const hex = colorMap[colorClass] || '#000000';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
