export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden hero-gradient-background">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-[-5%] left-[5%] w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"
          style={{ animation: 'float1 15s infinite ease-in-out' }}
        ></div>
        <div 
          className="absolute bottom-[-5%] right-[10%] w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50"
          style={{ animation: 'float2 20s infinite ease-in-out' }}
        ></div>
        <div 
          className="absolute top-[20%] right-[25%] w-64 h-64 bg-emerald-500/20 rounded-full filter blur-3xl opacity-40"
          style={{ animation: 'float3 18s infinite ease-in-out' }}
        ></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-28">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
          Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
        </p>
      </div>
    </section>
  );
};
