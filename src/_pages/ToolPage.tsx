import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { PDFProcessor } from "@/components/PDFProcessor";
import { ResultsPage } from "@/components/ResultsPage";
import { tools } from "@/constants/tools";
import { mergePDFs, splitPDF } from "@/lib/pdf-tools";
import { useToast } from "@/hooks/use-toast";

const BROWSER_ONLY_TOOLS = ["merge", "split"];

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const currentTool = tools.find(t => t.value === toolId);

  useEffect(() => {
    handleStartOver();
  }, [toolId]);

  if (!toolId || !currentTool) {
    return <Navigate to="/404" replace />;
  }

  const handleStartOver = () => {
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      // Make the download filename dynamic based on the tool
      a.download = toolId === 'split' 
        ? `pdfmingle_split_files.zip` 
        : `pdfmingle_${toolId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please select at least one file to process.", variant: "destructive" });
      return;
    }

    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId);

    try {
      let blob: Blob;

      // --- START OF THE FIX ---
      // This new logic correctly handles all browser-based tools
      if (!requiresBackend) {
        if (toolId === 'merge') {
          blob = await mergePDFs(files);
        } else if (toolId === 'split') {
          if (files.length > 1) {
            throw new Error("Please select only one file to split.");
          }
          blob = await splitPDF(files[0]);
        } else {
          // This is for any future browser-only tools you might add
          throw new Error("This tool is not yet implemented in the browser.");
        }
      } else {
        // This block now only runs for tools that NEED a backend
        const apiBaseUrl = "https://your-backend-server.com"; // Your real backend URL
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        blob = await response.blob();
      }
      // --- END OF THE FIX ---

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
