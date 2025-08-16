import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { Hero } from '@/components/Hero'; // 1. Import the new Hero component
import { tools } from '@/constants/tools';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* 2. Use the new Hero component */}
      <Hero />

      {/* The ToolGrid is now simpler */}
      <div className="container mx-auto px-4 text-center -mt-16 relative z-20">
         <ToolGrid tools={tools} />
      </div>

      <InformativePanel />
    </div>
  );
};

export default HomePage;
