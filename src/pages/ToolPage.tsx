
import { useParams } from "react-router-dom";
import { PDFProcessor } from "@/components/PDFProcessor";

// Mock tool data - in a real app, this might come from a config file
const tools = {
  merge: { title: "Merge PDF files", description: "Combine PDFs in the order you want with the easiest PDF merger available." },
  split: { title: "Split PDF file", description: "Separate one page or a whole set for easy conversion into independent PDF files." },
  // ... add other tools here
};

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: keyof typeof tools }>();
  
  if (!toolId || !tools[toolId]) {
    // Optional: Render a fallback or redirect if the tool is not found
    return <div>Tool not found</div>;
  }

  const { title, description } = tools[toolId];

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">{description}</p>
      <div className="w-full max-w-2xl">
        <PDFProcessor initialTool={toolId} />
      </div>
    </div>
  );
};

export default ToolPage;
