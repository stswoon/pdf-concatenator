import { useState, useEffect } from 'react';
import type { FileItem } from '../types';

const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<FileItem | null>(null);

  // Очистка URL объектов при размонтировании компонента
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  const addFiles = (newFiles: FileItem[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(file => file.id === id);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prevFiles.filter(file => file.id !== id);
    });
  };

  const reorderFiles = (reorderedFiles: FileItem[]) => {
    setFiles(reorderedFiles);
  };

  const selectPdf = (file: FileItem) => {
    setSelectedPdf(file);
  };

  const closePdf = () => {
    setSelectedPdf(null);
  };

  return {
    files,
    selectedPdf,
    addFiles,
    removeFile,
    reorderFiles,
    selectPdf,
    closePdf
  };
};

export default useFileManager;