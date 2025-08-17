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
  // 1. Add state for the processed file name
  const [processedFileName, setProcessedFileName] = useState<string>("download.pdf");

  const currentTool = tools.find(t => t.value === toolId);

  useEffect(() => {
    if (files.length > 0 && status === 'idle') {
      handleProcess();
    }
  }, [files, status]);

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
    if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
    }
    setFiles([]);
    setStatus("idle");
    setDownloadUrl(null);
    setProcessedFileName("download.pdf");
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      // Use the state for the download name
      a.download = processedFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleProcess = async () => {
    if (files.length === 0 || !toolId) return;

    setStatus("processing");
    const requiresBackend = !BROWSER_ONLY_TOOLS.includes(toolId as string);

    try {
      let blob: Blob;
      let outputName = toolId as string;
      let outputExtension = 'pdf';

      // --- LOGIC FIX: Changed `!requiresBackend` to `requiresBackend` ---
      if (requiresBackend) {
        // This block now correctly handles tools that need the backend
        const apiBaseUrl = "https://pdfmingle-backend.onrender.com";
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const endpoint = `${apiBaseUrl}/${toolId}`;
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        blob = await response.blob();
        outputName = `${files[0].name.replace(/\.[^/.]+$/, "")}_processed`;
        if (response.headers.get("Content-Type") === 'application/zip') {
          outputExtension = 'zip';
        }
      } else {
        // This block now correctly handles browser-only tools
        switch (toolId) {
          case 'merge-pdf':
            blob = await mergePDFs(files);
            outputName = 'merged';
            break;
          case 'split-pdf':
            if (files.length > 1) throw new Error("Please select only one file to split.");
            blob = await splitPDF(files[0]);
            outputName = `${files[0].name.replace('.pdf', '')}_split`;
            outputExtension = 'zip';
            break;
          case 'rotate-pdf':
            if (files.length > 1) throw new Error("Please select only one file.");
            blob = await rotatePDF(files[0], 90);
            outputName = `${files[0].name.replace('.pdf', '')}_rotated`;
            break;
          case 'jpg-to-pdf':
            blob = await jpgToPDF(files);
            outputName = 'images_converted';
            break;
          case 'add-page-numbers':
            if (files.length > 1) throw new Error("Please select only one file.");
            blob = await addPageNumbersPDF(files[0]);
            outputName = `${files[0].name.replace('.pdf', '')}_numbered`;
            break;
          default:
            throw new Error("Tool not implemented for browser processing.");
        }
      }

      const finalFileName = `${outputName}.${outputExtension}`;
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(finalFileName); // Set the full file name
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
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-2">{currentTool.label}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">{currentTool.description}</p>

      <div className="w-full max-w-2xl">
        {status === 'success' ? (
          // 3. Pass the 'fileName' prop
          <ResultsPage
            downloadUrl={downloadUrl}
            onDownload={handleDownload}
            onStartOver={handleStartOver}
            fileName={processedFileName}
          />
        ) : status === 'processing' ? (
          <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed rounded-lg">
            <p className="text-lg font-semibold animate-pulse">Processing your files...</p>
          </div>
        ) : (
          <PDFProcessor onFilesSelected={setFiles} />
        )}
      </div>
    </div>
  );
};

export default ToolPage;
