import { ToolGrid } from '@/components/ToolGrid';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 text-center">
      {/* Hero Section */}
      <div className="py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Your Go-To Solution for Any PDF Task
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Facing a document challenge? We have the solution. Our website offers a complete toolkit to handle any task, from using our simple tool to <strong className="text-foreground">merge PDF online</strong> to converting files with our trusted <strong className="text-foreground">PDF converter</strong>. You can even <strong className="text-foreground">edit PDF online</strong> or add a watermark for free. It’s the simple, secure, and stress-free way to manage your documents.
        </p>
      </div>

      {/* Tool Grid Section */}
      <ToolGrid />
    </div>
  );
};

export default HomePage;
