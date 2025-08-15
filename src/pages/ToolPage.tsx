import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PDFProcessor } from "@/components/PDFProcessor";
import { ResultsPage } from "@/components/ResultsPage";
import { tools } from "@/constants/tools";
import { mergePDFs, splitPDF, rotatePDF, jpgToPDF, addPageNumbersPDF } from "@/lib/pdf-tools";
import { useToast } from "@/hooks/use-toast";
import NotFoundPage from "@/pages/404";

const BROWSER_ONLY_TOOLS = [
  "merge-pdf", 
  "split-pdf", 
  "rotate-pdf", 
  "jpg-to-pdf",
  "add-page-numbers"
];

const ToolPage = () => {
  const router = useRouter();
  const { toolId } = router.query;
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const currentTool = tools.find(t => t.value === toolId);

  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      handleProcess();
    }
  }, [files]);

  useEffect(() => {
    handleStartOver();
  }, [toolId]);
  
  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  if (!toolId || !currentTool) {
    return <NotFoundPage />;
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
      const extension = toolId === 'split-pdf' || toolId === 'pdf-to-jpg' ? 'zip' : 'pdf';
      a.download = `pdfmingle_${toolId}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId as string);

    try {
      let blob: Blob;

      if (!requiresBackend) {
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
      } else {
        switch (toolId) {
          case 'merge-pdf':
            blob = await mergePDFs(files);
            break;
          case 'split-pdf':
            if (files.length > 1) throw new Error("Please select only one file to split.");
            blob = await splitPDF(files[0]);
            break;
          case 'rotate-pdf':
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
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      toast({ title: "Success!", description: "Your files have been processed." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatus("idle");
      setFiles([]);
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">{currentTool.label}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">{currentTool.description}</p>
      
      <div className="w-full max-w-2xl">
        {status === 'success' ? (
          <ResultsPage
            downloadUrl={downloadUrl}
            onDownload={handleDownload}
            onStartOver={handleStartOver}
          />
        ) : status === 'processing' ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
          </div>
        ) : (
          // --- THIS IS THE FIX ---
          // The PDFProcessor now only receives the one prop it needs.
          <PDFProcessor onFilesSelected={setFiles} />
        )}
      </div>
    </div>
  );
};

export default ToolPage;
