import { Header } from "@/components/Header";
import { PDFProcessor } from "@/components/PDFProcessor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <PDFProcessor />
      </main>
    </div>
  );
};

export default Index;
