// src/components/ToolGrid.tsx

import Link from 'next/link';
import { Tool, iconMap } from '@/constants/tools';
import { FileQuestion } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid = ({ tools }: ToolGridProps) => {
  return (
   // --- FIX: Changed top padding to be smaller (py- to pt-) ---
   <section id="tools" className="w-full bg-background pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || FileQuestion;
            return (
              <Link
                href={`/${tool.value}`}
                key={tool.value}
                className="group block"
              >
                <Card className="h-full flex flex-col items-center text-center p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="mb-4">
                      <Icon className="h-12 w-12" style={{ color: tool.color }} />
                    </div>
                    <CardTitle className="text-xl">{tool.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2 flex-grow">
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
