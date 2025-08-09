import { FileText } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-hero text-white py-8 px-6 text-center shadow-glow">
      <div className="flex items-center justify-center gap-3 mb-2">
        <FileText className="h-12 w-12" />
        <h1 className="text-5xl font-bold tracking-tight">PDFX</h1>
      </div>
      <p className="text-xl text-white/90 font-medium">Your All-in-One PDF Toolkit</p>
    </header>
  );
};