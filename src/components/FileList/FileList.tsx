import './FileList.css';
import { useState, type DragEvent} from 'react';
import type { FileItem as FileItemType } from '../../types';
import FileItem from "../FileItem/FileItem.tsx";

interface FileListProps {
  files: FileItemType[];
  onFilesReorder: (reorderedFiles: FileItemType[]) => void;
  onRemoveFile: (id: string) => void;
  onPdfSelect: (file: FileItemType) => void;
}

const FileList = ({ files, onFilesReorder, onRemoveFile, onPdfSelect }: FileListProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  // const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    // Для Firefox
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    // setDragOverItem(null);
  };

  const handleDrop = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetId) {
      const draggedIndex = files.findIndex(file => file.id === draggedItem);
      const targetIndex = files.findIndex(file => file.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newFiles = [...files];
        const [movedItem] = newFiles.splice(draggedIndex, 1);
        newFiles.splice(targetIndex, 0, movedItem);
        
        onFilesReorder(newFiles);
      }
    }
    
    setDraggedItem(null);
    // setDragOverItem(null);
  };

  if (files.length === 0) {
    return <div className="no-files">No files uploaded yet</div>;
  }

  return (
    <div className="files-list">
      {files.map((file, index) => (
        <FileItem
          key={file.id}
          file={file}
          index={index}
          onRemove={onRemoveFile}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPdfSelect={onPdfSelect}
        />
      ))}
    </div>
  );
};

export default FileList;