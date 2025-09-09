// src/pages/add-watermark.tsx

// ... (all imports remain the same)

// ... (all code before the return statement remains the same)

  return (
    <>
      <NextSeo title={tool.metaTitle} description={tool.metaDescription} canonical={`https://pdfmingle.com/${tool.value}`} />
      
      {/* 
        The `main` element has been removed from here and is now only in MainLayout.
        This ensures we don't have nested <main> tags.
      */}
      <div className="w-full h-full">
        {(status === 'idle' || status === 'error') ? (
          // THIS IS THE FIX:
          // We add padding here to compensate for the flush layout.
          // This container centers the content and adds vertical/horizontal space.
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{tool.h1}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>
            <ToolUploader onFilesSelected={handleFileSelected} acceptedFileTypes={{ 'application/pdf': ['.pdf'] }} selectedFiles={file ? [file] : []} isMultiFile={false} error={error} onProcess={() => {}} actionButtonText={tool.label} />
            {status === 'error' && (<Button onClick={handleStartOver} variant="outline" className="mt-4">Try Again</Button>)}
          </div>
        ) : status === 'previewing' && file ? (
          // This part now works correctly because the parent has no padding
          <div className="flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
            <div className="w-full md:w-64 flex-shrink-0 h-48 md:h-full border-r bg-gray-50 shadow-md">
              <PdfThumbnailViewer file={file} currentPage={currentPage} onPageChange={setCurrentPage} pageCount={pageCount} />
            </div>
            <div className="flex-grow h-full flex items-center justify-center bg-gray-400 p-4 overflow-auto">
              <PdfWatermarkPreviewer file={file} pageIndex={currentPage} options={options} />
            </div>
            <div className="w-full md:w-80 flex-shrink-0 bg-gray-50 p-6 flex flex-col shadow-lg border-l">
              <div className="flex-grow overflow-y-auto pr-2">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Watermark Options</h2>
                <WatermarkOptions options={options} onOptionChange={setOptions} />
              </div>
              <Button size="lg" onClick={handleProcess} className="w-full mt-6 bg-brand-blue hover:bg-brand-blue-dark font-bold py-6 text-lg flex-shrink-0">
                <Droplets className="mr-2 h-5 w-5"/>
                Add Watermark
              </Button>
            </div>
          </div>
        ) : status === 'processing' ? (
          <div className="flex items-center justify-center h-[70vh]"><ToolProcessor /></div>
        ) : status === 'success' ? (
          <div className="container mx-auto p-8"><ToolDownloader downloadUrl={downloadUrl} onStartOver={handleStartOver} filename={processedFileName} /></div>
        ) : null }
      </div>
    </>
  );
};

export default AddWatermarkPage;
