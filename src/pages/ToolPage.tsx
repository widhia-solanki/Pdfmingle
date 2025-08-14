import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { PDFProcessor } from "@/components/PDFProcessor";
import { ResultsPage } from "@/components/ResultsPage";
import { tools } from "@/constants/tools";
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from "@/lib/pdf-tools";
import { useToast } from "@/hooks/use-toast";

const BROWSER_ONLY_TOOLS = [
  "merge-pdf", 
  "split-pdf", 
  "rotate-pdf", 
  "jpg-to-pdf",
  "add-page-numbers"
];

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const currentTool = tools.find(t => t.value === toolId);

  useEffect(() => { handleStartOver(); }, [toolId]);

  if (!toolId || !currentTool) return <Navigate to="/404" replace />;

  const handleStartOver = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      const extension = toolId === 'split-pdf' || toolId === 'pdf-to-jpg' ? 'zip' : 'pdf';
      a.download = `pdfmingle_${toolId}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", variant: "destructive" });
      return;
    }
    
    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId);

    try {
      let blob: Blob;

      if (!requiresBackend) {
        // --- CLIENT-SIDE LOGIC ---
        switch (toolId) {
          case 'merge-pdf':
            blob = await mergePDFs(files);
            break;
          case 'split-pdf':
            if (files.length > 1) throw new Error("Please select only one file to split.");
            blob = await splitPDF(files[0]);
            break;
          case 'rotate-pdf':
            // Note: For a real app, you'd add a UI to select the angle
            blob = await rotatePDF(files[0], 90);
            break;
          case 'jpg-to-pdf':
            blob = await jpgToPDF(files);
            break;
          case 'add-page-numbers':
            blob = await addPageNumbersPDF(files[0]);
            break;
          default:
            throw new Error("Tool not implemented for browser processing.");
        }
      } else {
        // --- BACKEND LOGIC ---
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com"; // Your real backend URL
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Server error: ${response.statusText}`);
        }
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      toast({ title: "Success!", description: "Your files have been processed." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  if (status === 'success') {
    return <ResultsPage 
      downloadUrl={downloadUrl}
      onDownload={handleDownload}
      onStartOver={handleStartOver}
    />;
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">{currentTool.label}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">{currentTool.description}</p>
      
      <PDFProcessor
        files={files}
        onFilesChange={setFiles}
        onProcess={handleProcess}
        status={status as "idle" | "processing"}
        selectedTool={toolId}
        onToolChange={() => {}}
        hideToolSelector={true}
      />
    </div>
  );
};

export default ToolPage;
