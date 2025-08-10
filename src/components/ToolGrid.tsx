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
    <section className="w-full max-w-5xl mx-auto">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
        <Button
          onClick={() => setActiveCategory('All')}
          variant={activeCategory === 'All' ? 'default' : 'outline'}
          className={cn(
            "rounded-full px-5 py-2 text-base md:text-sm",
            activeCategory === 'All' && 'bg-gray-800 text-white hover:bg-gray-700'
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
              "rounded-full px-5 py-2 text-base md:text-sm",
               activeCategory === category && 'bg-gray-800 text-white hover:bg-gray-700'
            )}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              to={`/${tool.value}`} 
              key={tool.value} 
              className="group flex items-center text-left p-4 border rounded-lg hover:shadow-lg hover:border-primary transition-all duration-300"
            >
              <Icon className={`h-10 w-10 mr-4 shrink-0 ${tool.color}`} />
              <div>
                <h3 className="font-semibold text-foreground text-lg">{tool.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
