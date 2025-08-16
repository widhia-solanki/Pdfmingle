import { ToolGrid } from '@/components/ToolGrid';
import { InformativePanel } from '@/components/InformativePanel';
import { tools } from '@/constants/tools'; // Import the full tools list

const HomePage = () => {
  // We no longer need the filtering state here, as we will show all tools.
  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full overflow-hidden bg-hero-bg text-white rounded-b-3xl">
        <div className="relative z-10 container mx-auto px-4 text-center pt-20 md:pt-28 pb-12 md:pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
          
          {/* 
            --- THIS IS THE FIX ---
            The entire filter button section that was here has been removed.
            --- END OF THE FIX ---
          */}
        </div>
      </section>

      {/* The ToolGrid now receives the complete, unfiltered list of tools */}
      <ToolGrid tools={tools} />

      <InformativePanel />
    </div>
  );
};

export default HomePage;
