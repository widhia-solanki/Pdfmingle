import { Logo } from "./Logo";
import { ToolsMenu } from "./ToolsMenu";
import { Link } from "react-router-dom"; // 1. IMPORT Link from react-router-dom

export const Header = () => {
  return (
    <header className="bg-gradient-hero text-white py-4 px-4 text-center shadow-glow flex items-center justify-between md:py-6 md:flex-col">
      
      {/* --- Mobile Only Logo --- */}
      {/* 2. WRAP the mobile logo with a Link */}
      <Link to="/" className="md:hidden">
        <Logo className="h-10 w-10" />
      </Link>

      {/* --- Centered Title and Desktop Logo/Tagline --- */}
      {/* 3. WRAP the entire center block with a Link for both desktop and mobile */}
      <Link to="/" className="flex flex-col items-center no-underline text-white">
        {/* Desktop Logo */}
        <Logo className="h-12 w-12 mb-1 hidden md:block" />
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight">PDFMingle</h1>
        {/* Desktop Tagline */}
        <p className="hidden md:block text-lg md:text-xl text-white/90 font-medium max-w-xs md:max-w-none mt-1">
          Every tool you need to work with PDFs in one place
        </p>
      </Link>

      {/* --- Menu on both Mobile and Desktop --- */}
      <ToolsMenu />
    </header>
  );
};
