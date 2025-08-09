import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react'
import './App.css'

interface FileItem {
  id: string;
  name: string;
  blob: Blob;
  url?: string; // URL для предпросмотра изображения
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles: FileItem[] = [];
      
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          newFiles.push({
            id: `${Date.now()}-${i}`,
            name: file.name,
            blob: file,
            url: url
          });
        }
      }
      
      setFiles([...files, ...newFiles]);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragStart = (file: FileItem) => {
    setDraggedItem(file);
  };

  const handleDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = useCallback((index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedItem) {
      const draggedIndex = files.findIndex(file => file.id === draggedItem.id);
      if (draggedIndex !== -1 && draggedIndex !== index) {
        const newFiles = [...files];
        // Remove the dragged item
        newFiles.splice(draggedIndex, 1);
        // Insert it at the new position
        newFiles.splice(index, 0, draggedItem);
        setFiles(newFiles);
      }
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  }, [draggedItem, files]);

  const removeFile = (id: string) => {
    const fileToRemove = files.find(file => file.id === id);
    if (fileToRemove && fileToRemove.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    setFiles(files.filter(file => file.id !== id));
  };
  
  // Очистка URL объектов при размонтировании компонента
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, []);

  return (
    <div className="app-container">
      <h1>Image Manager</h1>
      
      <div className="upload-section">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept="image/*" 
          multiple 
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-button">
          Upload Images
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="files-list">
          <h2>Uploaded Files</h2>
          <p>Drag and drop to reorder files</p>
          
          <div className="file-items">
            {files.map((file, index) => (
              <div 
                key={file.id}
                className={`file-item ${dragOverIndex === index ? 'drag-over' : ''}`}
                draggable
                onDragStart={() => handleDragStart(file)}
                onDragOver={handleDragOver(index)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop(index)}
              >
                {file.url && (
                  <div className="file-thumbnail">
                    <img src={file.url} alt={file.name} />
                  </div>
                )}
                <div className="file-info">
                  <span className="file-number">{index + 1}</span>
                  <span className="file-name">{file.name}</span>
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => removeFile(file.id)}
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
