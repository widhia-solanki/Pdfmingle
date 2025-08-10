import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolSelector } from "./ToolSelector";
import { FileUploader } from "./FileUploader";
import { StatusDisplay } from "./StatusDisplay";
import { useToast } from "@/hooks/use-toast";
import { Zap, Info } from "lucide-react";
import { mergePDFs } from "@/lib/pdf-tools";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// List of tools that can run entirely in the browser
const BROWSER_ONLY_TOOLS = ["merge"];

export const PDFProcessor = () => {
  const [selectedTool, setSelectedTool] = useState("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>("");
  const { toast } = useToast();

  // Check if the currently selected tool requires a backend server
  const requiresBackend = !BROWSER_ONLY_TOOLS.includes(selectedTool);

  useEffect(() => {
    const saved = localStorage.getItem("pdfmingle_api_base") || "";
    setApiBaseUrl(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("pdfmingle_api_base", apiBaseUrl);
  }, [apiBaseUrl]);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to process.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTool === "merge" && files.length < 2) {
      toast({
        title: "Insufficient files",
        description: "Please select at least two PDF files to merge.",
        variant: "destructive",
      });
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

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `merged.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        toast({ title: "Merged!", description: "Your PDFs were merged successfully." });
        return;
      }

      if (requiresBackend && !apiBaseUrl.trim()) {
        throw new Error("Backend URL is required for this tool.");
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/${selectedTool}`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      setStatusMessage("Processing complete! Your download should start automatically.");

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `processed_file.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your files have been processed successfully.",
      });

    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error?.message || "An error occurred during processing. Please try again.");
      console.error("Processing error:", error);

      toast({
        title: "Processing failed",
        description: error?.message || "There was an error processing your files.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = `processed_file.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-primary overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-primary mb-1">
            PDF Processing Center
          </CardTitle>
          <p className="text-muted-foreground">
            Select your tool and upload files to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-4 md:px-6 pb-6">
          <ToolSelector value={selectedTool} onValueChange={setSelectedTool} />

          {requiresBackend && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <label className="text-sm font-medium flex items-center gap-2">
                Backend URL
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This tool requires server-side processing. <br/> Please enter the URL of your backend.</p>
                  </TooltipContent>
                </Tooltip>
              </label>
              <Input
                placeholder="https://your-backend-server.com"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
              />
            </div>
          )}

          <FileUploader files={files} onFilesChange={setFiles} />

          <div className="flex justify-center pt-4">
            <Button
              variant="process"
              size="lg"
              onClick={handleProcess}
              disabled={status === "processing"}
              className="min-w-48"
            >
              <Zap className="h-5 w-5 mr-2" />
              {status === "processing" ? "Processing..." : "Process Files"}
            </Button>
          </div>

          <StatusDisplay
            status={status}
            message={statusMessage}
            onDownload={downloadUrl ? handleDownload : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};
// ... imports

// Add this interface at the top
interface PDFProcessorProps {
  initialTool?: string;
}

export const PDFProcessor = ({ initialTool = "merge" }: PDFProcessorProps) => { // Modify this line
  const [selectedTool, setSelectedTool] = useState(initialTool); // Modify this line

  // ... rest of the component code remains the same
