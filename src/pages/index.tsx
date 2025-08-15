import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';

const HomePage = () => {
  return (
    // The main container is now simpler as sections handle their own styles
    <div className="w-full">
      {/* Hero Section (from before) */}
      <section className="relative w-full overflow-hidden hero-gradient-background rounded-b-3xl">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute top-[-5%] left-[5%] w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"
            style={{ animation: 'float1 15s infinite ease-in-out' }}
          ></div>
          <div 
            className="absolute bottom-[-5%] right-[10%] w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50"
            style={{ animation: 'float2 20s infinite ease-in-out' }}
          ></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
          </p>
        </div>
      </section>

      {/* Tool Grid and Filters Section */}
      {/* The ToolGrid component now lives inside the homepage */}
      <ToolGrid />

      {/* New Informative Panel Section */}
      <InformativePanel />
    </div>
  );
};

export default HomePage;
