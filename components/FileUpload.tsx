import React, { useState, useCallback, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { formatBytes } from '../utils/helpers';
import { UploadIcon, PdfIcon, CloseIcon } from './Icons';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  error: string | null;
  clearError: () => void;
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
  
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
      >
        {pending ? 'Compressing...' : 'Compress PDF'}
      </button>
    );
};

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileSelect, error, clearError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleSelectFileClick = () => {
      inputRef.current?.click();
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 transition-all duration-300 w-full">
      {!file ? (
        <>
            <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200 mb-2">Compress PDF File</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Reduce the size of your PDF files for free.</p>
            <div
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200 ${
                isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
            }`}
            onClick={handleSelectFileClick}
            >
            <input
                ref={inputRef}
                type="file"
                name="pdf"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                required
            />
            <div className="flex flex-col items-center justify-center space-y-4 text-slate-500 dark:text-slate-400">
                <UploadIcon className="w-12 h-12" />
                <p className="text-lg">
                Drag & drop your PDF here or <span className="font-semibold text-indigo-600 dark:text-indigo-400">choose file</span>
                </p>
                <p className="text-sm">Max file size: 100MB</p>
            </div>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200 mb-6">File Ready for Compression</h2>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-4 flex items-center space-x-4">
                <PdfIcon className="w-12 h-12 text-red-500 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate" title={file.name}>
                        {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                </div>
                 {/* This hidden input ensures the file is part of the form submission */}
                 <input type="file" name="pdf" ref={inputRef} className="hidden" />
            </div>
          <SubmitButton />
        </div>
      )}
      {error && (
         <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative flex items-center justify-between" role="alert">
            <span className="block sm:inline">{error}</span>
            <button type="button" onClick={clearError} className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50">
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
      )}
    </div>
  );
};
