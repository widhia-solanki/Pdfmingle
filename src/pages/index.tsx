import { ToolGrid } from '@/components/ToolGrid';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* --- NEW ANIMATED HERO SECTION --- */}
      <section className="relative w-full overflow-hidden hero-gradient-background rounded-b-3xl">
        <div className="absolute inset-0 z-0">
          {/* Floating Shape 1 */}
          <div 
            className="absolute top-[-5%] left-[5%] w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"
            style={{ animation: 'float1 15s infinite ease-in-out' }}
          ></div>
          {/* Floating Shape 2 */}
          <div 
            className="absolute bottom-[-5%] right-[10%] w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50"
            style={{ animation: 'float2 20s infinite ease-in-out' }}
          ></div>
           {/* Floating Shape 3 */}
          <div 
            className="absolute top-[20%] right-[25%] w-64 h-64 bg-emerald-500/20 rounded-full filter blur-3xl opacity-40"
            style={{ animation: 'float3 18s infinite ease-in-out' }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
      </section>

      {/* --- TOOL GRID SECTION --- */}
      {/* We add some negative margin to pull the grid up slightly over the hero */}
      <div className="container mx-auto px-4 text-center -mt-16 relative z-20">
        <ToolGrid />
      </div>
    </div>
  );
};

export default HomePage;
