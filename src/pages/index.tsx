import { Hero } from '@/components/Hero';
import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { tools } from '@/constants/tools'; // Import the full list of tools

const HomePage = () => {
  // We no longer need the filtering state here, as we will show all tools.
  return (
    <div className="w-full">
      {/* 1. The Hero Section */}
      <Hero />

      {/* 2. The Tool Grid - It now receives the complete, unfiltered list of tools */}
      <ToolGrid tools={tools} />

      {/* 3. The Informative Panel at the bottom */}
      <InformativePanel />
    </div>
  );
};

export default HomePage;
