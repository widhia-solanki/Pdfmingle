import { ToolGrid } from '@/components/ToolGrid';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 text-center">
      {/* Hero Section */}
      <div className="py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      {/* Tool Grid Section */}
      <ToolGrid />
    </div>
  );
};

export default HomePage;
        
