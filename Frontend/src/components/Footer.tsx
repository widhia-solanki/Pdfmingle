// src/components/Footer.tsx

import { useRouter } from 'next/router';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { InformativePanel } from '@/components/InformativePanel';
import { toolArray } from '@/constants/tools';

const toolPaths = new Set(toolArray.map(tool => `/${tool.value}`));

export const Footer = () => {
  const router = useRouter();
  const isToolPage = toolPaths.has(router.pathname);

  if (isToolPage) {
    return <AdPlaceholder />;
  }
  
  return <InformativePanel />;
};
