// src/components/ToolComingSoon.tsx

import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { type Tool } from '@/types'; // Use the central type definition

interface ToolComingSoonProps {
  tool: Tool;
}

export const ToolComingSoon = ({ tool }: ToolComingSoonProps) => {
  // --- THIS IS THE FINAL, CORRECT FIX ---
  // The tool object itself now contains the component, so we just use it directly.
  const Icon = tool.Icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-6">
        <Icon className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800">{tool.title}</h1>
      <p className="mt-4 text-lg max-w-xl text-gray-600">
        This tool is currently under construction.
      </p>
      <p className="mt-2 text-md max-w-xl text-gray-500">
        Our team is working hard to bring this feature to you soon. We appreciate your patience!
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Wrench className="h-6 w-6 text-gray-400 animate-pulse" />
        <p className="text-gray-500 font-semibold">Coming Soon</p>
      </div>
      <Button asChild className="mt-8">
        <Link href="/">Back to All Tools</Link>
      </Button>
    </div>
  );
};
