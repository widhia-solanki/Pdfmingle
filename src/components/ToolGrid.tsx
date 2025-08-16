import { tools, ToolCategory } from '@/constants/tools';
import Link from 'next/link';

// --- NEW: Define props for the component ---
interface ToolGridProps {
  activeCategory: ToolCategory | 'All';
}

export const ToolGrid = ({ activeCategory }: ToolGridProps) => {
  // --- UPDATED: Filtering logic now uses the prop ---
  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <section className="w-full max-w-5xl mx-auto">
      {/* --- REMOVED: The filter buttons are no longer here --- */}

      {/* Tools Grid (This part is the same) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
              href={`/${tool.value}`} 
              key={tool.value} 
              className="group flex items-center text-left p-4 border rounded-lg bg-card hover:shadow-lg hover:border-primary transition-all duration-300"
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
