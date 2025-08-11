import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolSelector } from "./ToolSelector";
import { FileUploader } from "./FileUploader";
import { StatusDisplay } from "./StatusDisplay";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { mergePDFs } from "@/lib/pdf-tools";

// List of tools that can run entirely in the browser
const BROWSER_ONLY_TOOLS = ["merge"];

interface PDFProcessorProps {
  initialTool?: string;
  hideToolSelector?: boolean; // New prop
}

export const PDFProcessor = ({ initialTool = "merge", hideToolSelector = false }: PDFProcessorProps) => {
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Hardcode the backend URL here so the user doesn't see it.
  // IMPORTANT: Replace this with your actual backend URL.
  const apiBaseUrl = "https://your-backend-server.com"; 

  const { toast } = useToast();

  const requiresBackend = !BROWSER_ONLY_TOOLS.includes(selectedTool);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({ title: "No files selected", description: "Please select at least one file to process.", variant: "destructive" });
      return;
    }
    if (selectedTool === "merge" && files.length < 2) {
      toast({ title: "Insufficient files", description: "Please select at least two PDF files to merge.", variant: "destructive" });
      return;
    }
    
    setStatus("processing");
    setStatusMessage("Processing your files...");

    try {
      if (!requiresBackend && selectedTool === "merge") {
        const blob = await mergePDFs(files);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setStatus("success");
        setStatusMessage("Merge complete! Your download should start automatically.");
        // Auto-download logic...
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/${selectedTool}`;
      const response = await fetch(endpoint, { method: "POST", body: formData });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      setStatusMessage("Processing complete! Your download should start automatically.");
      // Auto-download logic...
      toast({ title: "Success!", description: "Your files have been processed successfully." });
    } catch (error: unknown) {
      setStatus("error");
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setStatusMessage(message);
      console.error("Processing error:", error);
      toast({ title: "Processing failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            PDF Processing Center
          </CardTitle>
          <p className="text-gray-500">
            Select your tool and upload files to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-4 md:px-6 pb-6">
          {/* Conditionally render the tool selector */}
          {!hideToolSelector && (
            <ToolSelector value={selectedTool} onValueChange={setSelectedTool} />
          )}

          <FileUploader files={files} onFilesChange={setFiles} />

          {/* This section now shows the button or the status */}
          {status === "idle" ? (
            <div className="flex justify-center pt-4">
              <Button
                variant="process"
                size="lg"
                onClick={handleProcess}
                disabled={files.length === 0}
                className="min-w-48 bg-ilovepdf-red hover:bg-ilovepdf-red-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {status === "processing" ? "Processing..." : `Process ${selectedTool.replace('-', ' ')}`}
              </Button>
            </div>
          ) : (
            <StatusDisplay
              status={status}
              message={statusMessage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
