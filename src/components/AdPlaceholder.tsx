// src/components/AdPlaceholder.tsx

import React from 'react';

export const AdPlaceholder = () => {
  return (
    // This is now a simple, invisible spacer.
    // It has no background, no border, and no text.
    // Its only job is to reserve a minimum height to prevent layout shift (CLS).
    // It will blend seamlessly with the page's background color.
    <div className="w-full min-h-[250px]" />
  );
};
