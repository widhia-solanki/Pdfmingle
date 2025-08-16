import Link from 'next/link';
import { Tool } from '@/constants/tools';

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid = ({ tools }: ToolGridProps) => {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
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
    </section>
  );
};
