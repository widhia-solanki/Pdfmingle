import { Hero } from '@/components/Hero';
import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { tools } from '@/constants/tools';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* This Hero component will now correctly be full-width */}
      <Hero />
      
      {/* The ToolGrid will handle its own background and container */}
      <ToolGrid tools={tools} />

      {/* The InformativePanel will also handle its own background */}
      <InformativePanel />
    </div>
  );
};

export default HomePage;
