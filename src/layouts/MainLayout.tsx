import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
