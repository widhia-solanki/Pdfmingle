// src/pages/unlock-pdf.tsx

import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ToolUploader } from '@/components/ToolUploader';
import { ToolProcessor } from '@/components/ToolProcessor';
import { ToolDownloader } from '@/components/ToolDownloader';
import PDFPreviewer from '@/components/PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { unlockPdf } from '@/lib/pdf/unlock';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Status = 'idle' | 'options' | 'processing' | 'success' | 'error';

const UnlockPdfPage: NextPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processedFileName, setProcessedFileName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setStatus('options');
      setError(null);
    } else {
      setFile(null);
      setStatus('idle');
    }
  };

  const handleStartOver = useCallback(() => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setPassword('');
    setError(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessedFileName('');
  }, [downloadUrl]);

  const handleProcess = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    if (!password) {
      setError("Please enter the password for the PDF.");
      return;
    }
    setError(null);
    setStatus('processing');
    try {
      const processed = await unlockPdf(file, password);
      const blob = new Blob([processed], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProcessedFileName(`unlocked_${file.name}`);
      setStatus('success');
    } catch (err: any) {
      // The error from unlockPdf is user-friendly
      setError(err.message);
      setStatus('options'); // Go back to the options screen to let the user retry
    }
  };
  
  const isProcessButtonDisabled = !password;

  return (
    <>
      <Head>
        <title>Unlock PDF - Remove Password from PDF</title>
        <meta name="description" content="Remove the password from your protected PDF file if you know the password. Fast, client-side, and secure." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Unlock PDF</h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Remove the password from an encrypted PDF file. You must know the current password.
        </p>
        
        {status === 'idle' && (
            <div className="max-w-4xl mx-auto">
                <ToolUploader 
                    onFilesSelected={handleFilesSelected}
                    acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                    selectedFiles={file ? [file] : []}
                    isMultiFile={false}
                    error={error}
                    onProcess={() => {}}
                    actionButtonText=""
                />
            </div>
        )}

        {status === 'options' && file && (
             <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
                <div className="md:sticky md:top-24">
                  <h2 className="text-2xl font-bold mb-4 text-center md:text-left">File to Unlock</h2>
                  <PDFPreviewer file={file} index={0} onRemove={handleStartOver} />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound /> Enter Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">PDF Password</Label>
                            <div className="relative">
                                <Input 
                                    id="password" 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter the current password"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        
                        <Button size="lg" onClick={handleProcess} className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isProcessButtonDisabled}>
                           Unlock PDF
                        </Button>
                    </CardContent>
                </Card>
             </div>
        )}

        {status === 'processing' && <ToolProcessor />}
        
        {status === 'success' && (
          <ToolDownloader
            downloadUrl={downloadUrl}
            filename={processedFileName}
            onStartOver={handleStartOver}
          />
        )}

        {status === 'error' && ( // This state is now less likely but kept for safety
            <div className="text-center p-8">
              <p className="text-red-500 font-semibold mb-4">{error}</p>
              <Button onClick={handleStartOver} variant="outline">Try Again</Button>
            </div>
        )}
      </div>
    </>
  );
};

export default UnlockPdfPage;
