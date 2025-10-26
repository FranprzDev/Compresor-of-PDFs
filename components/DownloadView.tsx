
import React, { useMemo } from 'react';
import { formatBytes } from '../utils/helpers';
import { CheckCircleIcon, DownloadIcon, RefreshIcon, PdfIcon } from './Icons';

interface DownloadViewProps {
  file: File;
  originalSize: number;
  compressedSize: number;
  onReset: () => void;
}

export const DownloadView: React.FC<DownloadViewProps> = ({ file, originalSize, compressedSize, onReset }) => {
  
  const reductionPercentage = useMemo(() => {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }, [originalSize, compressedSize]);

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    const fileNameParts = file.name.split('.');
    const extension = fileNameParts.pop();
    const name = fileNameParts.join('.');
    a.download = `${name}-compressed.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full text-center">
      <div className="flex justify-center mb-4">
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Compression Successful!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Your PDF has been compressed significantly.</p>
      
      <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 flex items-center space-x-4 mb-6">
        <PdfIcon className="w-12 h-12 text-red-500 flex-shrink-0" />
        <div className="flex-grow overflow-hidden text-left">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate" title={file.name}>
                {file.name}
            </p>
            <div className="flex items-baseline space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 line-through">{formatBytes(originalSize)}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatBytes(compressedSize)}</span>
            </div>
        </div>
        <div className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-sm font-bold px-3 py-1 rounded-full">
            -{reductionPercentage}%
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all duration-300"
        >
          <RefreshIcon className="w-5 h-5" />
          Compress Another
        </button>
      </div>
    </div>
  );
};
