
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ProcessingView } from './components/ProcessingView';
import { DownloadView } from './components/DownloadView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type View = 'UPLOAD' | 'PROCESSING' | 'DOWNLOAD';

const App: React.FC = () => {
  const [view, setView] = useState<View>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
  }, []);

  const handleCompress = useCallback(() => {
    if (!file) return;

    setView('PROCESSING');

    // Simulate PDF compression
    setTimeout(() => {
      // Simulate a compression ratio between 60% and 85%
      const reductionFactor = 1 - (Math.random() * 0.25 + 0.60);
      const newSize = Math.round(originalSize * reductionFactor);
      
      setCompressedSize(newSize);
      setView('DOWNLOAD');
    }, 4000); // Simulate a 4-second processing time
  }, [file, originalSize]);

  const handleReset = useCallback(() => {
    setView('UPLOAD');
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError(null);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'UPLOAD':
        return (
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            onCompress={handleCompress}
            error={error}
            clearError={() => setError(null)}
          />
        );
      case 'PROCESSING':
        return <ProcessingView />;
      case 'DOWNLOAD':
        return (
          <DownloadView
            file={file!}
            originalSize={originalSize}
            compressedSize={compressedSize}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {renderView()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
