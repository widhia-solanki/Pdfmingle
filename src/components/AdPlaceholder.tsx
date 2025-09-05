// src/components/AdPlaceholder.tsx

import React from 'react';

export const AdPlaceholder = () => {
  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto max-w-4xl">
        {/* 
          This is the placeholder for your ad.
          It has a defined height and some styling to be visible.
          You can replace this with your ad service component (e.g., Google AdSense) later.
        */}
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">Advertisement</span>
        </div>
      </div>
    </div>
  );
};
