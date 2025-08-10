import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        {/* Outlet renders the current page component */}
        <Outlet />
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
