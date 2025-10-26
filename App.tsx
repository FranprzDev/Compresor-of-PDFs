'use client';

import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { FileUpload } from './components/FileUpload';
import { ProcessingView } from './components/ProcessingView';
import { DownloadView } from './components/DownloadView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { compressPdfAction, CompressionSuccess, CompressionError } from './app/actions';

type View = 'UPLOAD' | 'PROCESSING' | 'DOWNLOAD';

type FormState = (CompressionSuccess | CompressionError | null);

const initialState: FormState = null;

const App: React.FC = () => {
  const [view, setView] = useState<View>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formState, formAction] = useFormState(compressPdfAction, initialState);

  useEffect(() => {
    if (!formState) {
        if (view === 'PROCESSING') {
            setView('UPLOAD'); // If form is reset, go back to upload
        }
        return;
    }

    if ('error' in formState) {
      setError(formState.error);
      setView('UPLOAD');
    } else {
      setView('DOWNLOAD');
    }
  }, [formState]);


  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
  }, []);

  const handleSubmit = (formData: FormData) => {
    if (!file) return;
    setView('PROCESSING');
    setError(null);
    formAction(formData);
  };

  const handleReset = useCallback(() => {
    setView('UPLOAD');
    setFile(null);
    setError(null);
    // This is a way to reset the form state by calling the action with empty data
    // A better approach in a real app might involve a dedicated reset action or keying the component.
    formAction(new FormData());
  }, [formAction]);

  const renderView = () => {
    switch (view) {
      case 'UPLOAD':
        return (
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            error={error}
            clearError={() => setError(null)}
          />
        );
      case 'PROCESSING':
        return <ProcessingView />;
      case 'DOWNLOAD':
        if (formState && 'fileName' in formState) {
          return (
            <DownloadView
              fileName={formState.fileName}
              originalSize={formState.originalSize}
              compressedSize={formState.compressedSize}
              compressedFileBase64={formState.compressedFileBase64}
              onReset={handleReset}
            />
          );
        }
        return <ProcessingView />; // Fallback while state updates
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <form action={handleSubmit} className="w-full max-w-2xl">
          {renderView()}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default App;
