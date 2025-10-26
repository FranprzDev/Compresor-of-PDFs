import type { Metadata } from 'next';
import './globals.css';
// FIX: Import React to make the React namespace available.
import React from 'react';

export const metadata: Metadata = {
  title: 'PDF Compressor Pro',
  description: 'A powerful web application to reduce the size of your PDF files significantly, with a clean and easy-to-use interface. Upload your file and get a smaller, optimized PDF in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900">{children}</body>
    </html>
  );
}