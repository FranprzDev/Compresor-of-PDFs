
import React, { useState, useEffect } from 'react';

const messages = [
  'Analyzing PDF structure...',
  'Optimizing images and fonts...',
  'Applying high-compression algorithms...',
  'Removing redundant data...',
  'Finalizing your smaller PDF...'
];

export const ProcessingView: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 800);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Compressing...</h2>
      <p className="text-slate-500 dark:text-slate-400 transition-opacity duration-300 ease-in-out">{message}</p>
    </div>
  );
};
