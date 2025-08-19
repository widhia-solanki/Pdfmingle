// src/components/tools/ToolProcessor.tsx

import { Loader2 } from 'lucide-react';

export const ToolProcessor = () => (
  <div className="flex flex-col items-center justify-center p-12 gap-4">
    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
    <p className="text-lg font-semibold text-gray-700 animate-pulse">Processing your file...</p>
    <p className="text-gray-500">Please wait a few moments.</p>
  </div>
);
