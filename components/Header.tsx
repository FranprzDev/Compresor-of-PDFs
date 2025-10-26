
import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-6">
      <div className="container mx-auto flex items-center">
        <LogoIcon className="w-8 h-8 text-indigo-600" />
        <h1 className="text-xl font-bold ml-2 text-slate-800 dark:text-slate-100">PDF Compressor Pro</h1>
      </div>
    </header>
  );
};
