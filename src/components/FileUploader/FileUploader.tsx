import { useRef } from 'react';
import type { FileItem } from '../../types';
import './FileUploader.css';

interface FileUploaderProps {
  onFilesAdded: (newFiles: FileItem[]) => void;
}

const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles: FileItem[] = [];
      
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const url = URL.createObjectURL(file);
        
        if (file.type.startsWith('image/')) {
          newFiles.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            blob: file,
            url: url,
            type: 'image'
          });
        } else if (file.type === 'application/pdf') {
          // Для PDF файлов создаем запись с типом 'pdf'
          newFiles.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            blob: file,
            url: url,
            type: 'pdf'
          });
        }
      }
      
      onFilesAdded(newFiles);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-section">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        accept="image/*,application/pdf" 
        multiple 
        className="file-input"
        id="file-input"
      />
      <label htmlFor="file-input" className="upload-button">
        Upload Images
      </label>
    </div>
  );
};

export default FileUploader;