import { CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatusDisplayProps {
  status: "idle" | "processing" | "success" | "error";
  message: string;
  onDownload?: () => void;
}

export const StatusDisplay = ({ status, message, onDownload }: StatusDisplayProps) => {
  if (status === "idle") return null;

  const getIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getCardClassName = () => {
    switch (status) {
      case "processing":
        return "border-primary/30 bg-primary/5";
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-destructive/30 bg-destructive/5";
      default:
        return "";
    }
  };

  return (
    <Card className={`p-4 ${getCardClassName()} transition-smooth`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="flex-1 text-sm font-medium">{message}</p>
        {status === "success" && onDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </Card>
  );
};