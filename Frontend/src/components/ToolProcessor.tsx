// src/components/ToolProcessor.tsx (or tools/ToolProcessor.tsx)

import { Loader2 } from 'lucide-react';

export const ToolProcessor = () => (
  <div className="flex flex-col items-center justify-center p-12 gap-4">
    <Loader2 className="w-16 h-16 text-primary animate-spin" />
    {/* THE FIX: Use semantic colors for the text. */}
    <p className="text-lg font-semibold text-foreground animate-pulse">Processing your file...</p>
    <p className="text-muted-foreground">Please wait a few moments.</p>
  </div>
);
