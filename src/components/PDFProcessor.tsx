import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolSelector } from "./ToolSelector";
import { FileUploader } from "./FileUploader";
import { Zap } from "lucide-react";

interface PDFProcessorProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onProcess: () => void;
  status: "idle" | "processing";
  selectedTool: string;
  onToolChange: (tool: string) => void;
  hideToolSelector?: boolean;
}

export const PDFProcessor = ({
  files,
  onFilesChange,
  onProcess,
  status,
  selectedTool,
  onToolChange,
  hideToolSelector = false,
}: PDFProcessorProps) => {
  const isProcessing = status === 'processing';

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-lg border-gray-200 animate-in fade-in duration-300">
        {!hideToolSelector && (
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              PDF Processing Center
            </CardTitle>
            <p className="text-gray-500">
              Select your tool and upload files to get started
            </p>
          </CardHeader>
        )}
        <CardContent className="space-y-6 px-4 md:px-6 pb-6 pt-6">
          {!hideToolSelector && (
            <ToolSelector value={selectedTool} onValueChange={onToolChange} />
          )}

          <FileUploader files={files} onFilesChange={onFilesChange} />
          
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={onProcess}
              disabled={files.length === 0 || isProcessing}
              className="w-full max-w-xs h-16 text-xl font-bold bg-ilovepdf-red hover:bg-ilovepdf-red-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Zap className="mr-2 h-6 w-6" />
              {isProcessing ? "Processing..." : `Process ${selectedTool.replace('-', ' ')}`}
            </Button>
          </div>

          {isProcessing && (
              <p className="text-center text-gray-500 animate-pulse">Please wait while we process your files...</p>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
