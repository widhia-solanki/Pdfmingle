// src/pages/[toolId].tsx

import { useState, useMemo } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { NextSeo } from 'next-seo';

import { tools, Tool, iconMap } from '@/constants/tools';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, FileIcon, Download, RotateCw } from 'lucide-react';
import { PDFPreviewer } from '@/components/PDFPreviewer';
import NotFoundPage from '@/pages/404';

// Import our new client-side processing functions
import { mergePDFs } from '@/lib/pdf/merge';
import { splitPDF } from '@/lib/pdf/split';
import { rotatePDF } from '@/lib/pdf/rotate';
import { protectPDF } from '@/lib/pdf/protect';

type ToolStatus = 'idle' | 'processing' | 'success' | 'error';

interface ToolPageProps {
  tool: Tool;
}

const ToolPage: NextPage<ToolPageProps> = ({ tool }) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');

  // Tool-specific options state
  const [rotationAngle, setRotationAngle] = useState(90);

  const isMultiFile = tool.value === 'merge-pdf';

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(isMultiFile ? [...files, ...acceptedFiles] : [acceptedFiles[0]]);
    setStatus('idle');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  const handleProcess = async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setErrorMessage('');

    try {
      let resultBlob: Blob;
      let filename = 'result.pdf';

      switch (tool.value) {
        case 'merge-pdf':
          const mergedBytes = await mergePDFs(files);
          resultBlob = new Blob([mergedBytes], { type: 'application/pdf' });
          filename = 'merged.pdf';
          break;
        case 'split-pdf':
          resultBlob = await splitPDF(files[0]);
          filename = 'split_pages.zip';
          break;
        case 'rotate-pdf':
            const rotatedBytes = await rotatePDF(files[0], rotationAngle);
            resultBlob = new Blob([rotatedBytes], { type: 'application/pdf' });
            filename = 'rotated.pdf';
            break;
        case 'protect-pdf':
            const password = prompt("Enter a password to protect the PDF:");
            if (!password) {
                setStatus('idle');
                return;
            }
            const protectedBytes = await protectPDF(files[0], password);
            resultBlob = new Blob([protectedBytes], { type: 'application/pdf' });
            filename = 'protected.pdf';
            break;
        // Cases for other tools would go here
        default:
          throw new Error("This tool is coming soon!");
      }

      const url = URL.createObjectURL(resultBlob);
      setDownloadUrl(url);
      setDownloadFilename(filename);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setStatus('error');
    }
  };
  
  const handleStartOver = () => {
    setFiles([]);
    setStatus('idle');
    setErrorMessage('');
    if(downloadUrl) URL.revokeObjectURL(downloadUrl);
  };
  
  const renderContent = () => {
    switch (status) {
      case 'processing':
        return <div className="text-center p-10"><Loader2 className="w-12 h-12 mx-auto animate-spin" /><p className="mt-4">Processing...</p></div>;
      case 'success':
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold mb-4">Your file is ready!</h2>
                <a href={downloadUrl} download={downloadFilename}>
                    <Button size="lg"><Download className="mr-2" /> Download</Button>
                </a>
                <Button variant="outline" onClick={handleStartOver} className="ml-4"><RotateCw className="mr-2" /> Start Over</Button>
            </div>
        );
      case 'error':
        return <div className="text-center p-10"><p className="text-red-500">{errorMessage}</p><Button variant="outline" onClick={handleStartOver}>Try Again</Button></div>;
      case 'idle':
      default:
        return (
          <>
            <div {...getRootProps()} className={`p-10 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-blue-500' : ''}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2"><UploadCloud className="w-10 h-10" /><p>Drag & drop files here, or click to select files</p></div>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Selected file(s):</h3>
                <ul>
                  {files.map(file => <li key={file.name} className="flex items-center gap-2"><FileIcon />{file.name}</li>)}
                </ul>
                {!isMultiFile && <div className="mt-4"><PDFPreviewer file={files[0]} /></div>}
                
                {/* Tool-specific options */}
                {tool.value === 'rotate-pdf' && (
                    <div className="mt-4">
                        <label>Rotation Angle: </label>
                        <select value={rotationAngle} onChange={(e) => setRotationAngle(Number(e.target.value))} className="p-2 border rounded">
                            <option value={90}>90° Clockwise</option>
                            <option value={180}>180°</option>
                            <option value={270}>90° Counter-Clockwise</option>
                        </select>
                    </div>
                )}

                <Button size="lg" onClick={handleProcess} className="mt-6">Process Now</Button>
              </div>
            )}
          </>
        );
    }
  };

  if (!tool) return <NotFoundPage />;

  return (
    <>
      <NextSeo title={tool.metaTitle} description={tool.metaDescription} />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{tool.h1}</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">{tool.description}</p>
        <div className="mt-8 w-full max-w-4xl mx-auto">{renderContent()}</div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => { /* ... Unchanged ... */ };
export const getStaticProps: GetStaticProps = async ({ params }) => { /* ... Unchanged ... */ };

export default ToolPage;
