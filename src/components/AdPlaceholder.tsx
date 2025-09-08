// src/components/AdPlaceholder.tsx

import React from 'react';

export const AdPlaceholder = () => {
  return (
    <div className="w-full py-8 md:py-12 flex justify-center">
      {/* 
        The container still reserves a minimum height to prevent layout shift.
        The "Advertisement" text has been removed from inside.
      */}
      <div className="w-full max-w-lg min-h-[250px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
        {/* This space is now intentionally left empty */}
      </div>
    </div>
  );
};
