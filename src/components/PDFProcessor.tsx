import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolSelector } from "./ToolSelector";
import { FileUploader } from "./FileUploader";
import { StatusDisplay } from "./StatusDisplay";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export const PDFProcessor = () => {
  const [selectedTool, setSelectedTool] = useState("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

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
        description: "Please select at least two files to merge.",
        variant: "destructive",
      });
      return;
    }

    setStatus("processing");
    setStatusMessage("Processing your files...");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      // Simulate API call - replace with actual endpoint
      const response = await fetch(`/${selectedTool}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
      setStatusMessage("Processing complete! Your download should start automatically.");

      // Auto-download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `processed_file.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your files have been processed successfully.",
      });
    } catch (error) {
      setStatus("error");
      setStatusMessage("An error occurred during processing. Please try again.");
      console.error("Processing error:", error);
      
      toast({
        title: "Processing failed",
        description: "There was an error processing your files. Please try again.",
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
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-primary">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-primary mb-2">
            PDF Processing Center
          </CardTitle>
          <p className="text-muted-foreground">
            Select your tool and upload files to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <ToolSelector value={selectedTool} onValueChange={setSelectedTool} />
          <FileUploader files={files} onFilesChange={setFiles} />
          
          <div className="flex justify-center pt-4">
            <Button
              variant="process"
              size="lg"
              onClick={handleProcess}
              disabled={status === "processing"}
              className="min-w-40"
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