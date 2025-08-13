import { Header } from "@/components/Header";
import { Link, Outlet } from "react-router-dom"; // This will be updated later

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {/* In Next.js, this will be handled by the children prop, not Outlet */}
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        <div className="flex justify-center items-center gap-4 mb-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="text-gray-300">|</span>
          <Link to="/about" className="hover:underline">About Us</Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
