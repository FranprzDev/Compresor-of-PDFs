'use server';

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import os from 'os';
// FIX: Import Buffer to make it available as it may not be in the global scope.
import { Buffer } from 'buffer';

const execPromise = promisify(exec);

export interface CompressionSuccess {
  compressedFileBase64: string;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

export interface CompressionError {
    error: string;
}

export async function compressPdfAction(formData: FormData): Promise<CompressionSuccess | CompressionError> {
  const file = formData.get('pdf') as File;

  if (!file || file.type !== 'application/pdf') {
    return { error: 'Please upload a valid PDF file.' };
  }

  const tempDir = os.tmpdir();
  const uniqueFileName = `${Date.now()}-${file.name}`;
  const inputPath = path.join(tempDir, uniqueFileName);
  const outputPath = path.join(tempDir, `compressed-${uniqueFileName}`);

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, fileBuffer);

    const command = `
      gs -sDEVICE=pdfwrite \
      -dCompatibilityLevel=1.4 \
      -dPDFSETTINGS=/ebook \
      -dNOPAUSE -dQUIET -dBATCH \
      -sOutputFile="${outputPath}" "${inputPath}"
    `;

    await execPromise(command);

    const compressedFileBuffer = await fs.readFile(outputPath);
    const compressedStats = await fs.stat(outputPath);
    
    return {
      compressedFileBase64: compressedFileBuffer.toString('base64'),
      originalSize: file.size,
      compressedSize: compressedStats.size,
      fileName: file.name
    };
  } catch (error: any) {
    console.error("Error during PDF compression:", error);
    if (error.message.includes('command not found') || error.message.includes('is not recognized')) {
        return { error: 'Ghostscript is not installed on the server or is not in the system PATH.' };
    }
    return { error: 'An unexpected error occurred during compression.' };
  } finally {
    try {
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
  }
}