import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileCheck2, RotateCw } from "lucide-react";

// 1. Add 'fileName' to the props interface
interface ResultsPageProps {
  downloadUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
  fileName: string; // <-- Add this line
}

// 2. Accept 'fileName' as a prop
export const ResultsPage = ({ downloadUrl, onDownload, onStartOver, fileName }: ResultsPageProps) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-500">
      <Card className="w-full shadow-lg border-gray-200 p-8">
        <CardContent className="flex flex-col items-center gap-6 p-0">
          <FileCheck2 className="h-20 w-20 text-green-500" />
          <h2 className="text-3xl font-bold text-gray-800">
            Your files are ready!
          </h2>
          {/* 3. Display the file name to the user */}
          <p className="text-gray-600 font-medium text-lg break-all px-4">
            {fileName}
          </p>
          <div className="w-full flex flex-col items-center gap-4 mt-4">
            <Button
              onClick={onDownload}
              disabled={!downloadUrl}
              className="w-full max-w-xs h-16 text-xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Download className="mr-3 h-6 w-6" />
              Download File
            </Button>
            <Button
              variant="outline"
              onClick={onStartOver}
              className="w-full max-w-xs h-12 text-lg"
            >
              <RotateCw className="mr-2 h-5 w-5" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
