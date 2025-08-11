import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { PDFProcessor } from "@/components/PDFProcessor";
import { ResultsPage } from "@/components/ResultsPage";
import { tools } from "@/constants/tools";
import { mergePDFs } from "@/lib/pdf-tools";
import { useToast } from "@/hooks/use-toast";

const BROWSER_ONLY_TOOLS = ["merge"];

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const currentTool = tools.find(t => t.value === toolId);

  // Reset state when the tool changes
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
      a.download = `processed_${toolId}.pdf`; // Dynamic filename
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
    const apiBaseUrl = "https://your-backend-server.com"; // Your backend URL
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId);

    try {
      let blob: Blob;

      if (!requiresBackend && toolId === 'merge') {
        blob = await mergePDFs(files);
      } else {
        if (requiresBackend && !apiBaseUrl) {
          throw new Error("Backend URL is not configured.");
        }
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        blob = await response.blob();
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      toast({ title: "Success!", description: "Your files have been processed." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle"); // Go back to idle on error to allow retry
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  // If processing was successful, show the results page.
  if (status === 'success') {
    return <ResultsPage 
      downloadUrl={downloadUrl}
      onDownload={handleDownload}
      onStartOver={handleStartOver}
    />;
  }
  
  // Otherwise, show the uploader.
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
        onToolChange={() => {}} // Not used here
        hideToolSelector={true}
      />
    </div>
  );
};

export default ToolPage;
