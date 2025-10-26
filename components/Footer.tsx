
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
      <p>&copy; {new Date().getFullYear()} PDF Compressor Pro. All Rights Reserved.</p>
    </footer>
  );
};
