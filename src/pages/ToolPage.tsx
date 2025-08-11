import { useParams, Navigate } from "react-router-dom";
import { PDFProcessor } from "@/components/PDFProcessor";
import { tools } from "@/constants/tools";

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();

  const currentTool = tools.find(t => t.value === toolId);
  
  if (!toolId || !currentTool) {
    return <Navigate to="/404" replace />;
  }

  const { label, description } = currentTool;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">{label}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">{description}</p>
      <div className="w-full max-w-2xl">
        {/* Pass the new props here */}
        <PDFProcessor initialTool={toolId} hideToolSelector={true} />
      </div>
    </div>
  );
};

export default ToolPage;
