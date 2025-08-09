import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react'
import { jsPDF } from "jspdf";
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
  
  // Функция для создания PDF из изображений
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const generatePdf = async () => {
    if (files.length === 0 || isGeneratingPdf) return;
    
    setIsGeneratingPdf(true);
    
    try {
      // Создаем новый PDF документ формата A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Размеры страницы A4 в мм
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Отступы от краев страницы
      const margin = 10;
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);
      
      // Обрабатываем каждое изображение
      for (let i = 0; i < files.length; i++) {
        // Добавляем новую страницу для каждого изображения, кроме первого
        if (i > 0) {
          pdf.addPage();
        }
        
        const file = files[i];
        const img = new Image();
        
        // Загружаем изображение и добавляем его в PDF
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            // Вычисляем размеры для сохранения пропорций
            let imgWidth = img.width;
            let imgHeight = img.height;
            
            // Масштабируем изображение, чтобы оно поместилось на странице
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            imgWidth = imgWidth * ratio;
            imgHeight = imgHeight * ratio;
            
            // Вычисляем позицию для центрирования изображения
            const x = margin + (maxWidth - imgWidth) / 2;
            const y = margin + (maxHeight - imgHeight) / 2;
            
            // Добавляем изображение в PDF
            pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
            resolve();
          };
          
          img.onerror = () => {
            reject(new Error(`Failed to load image: ${file.name}`));
          };
          
          if (file.url) {
            img.src = file.url;
          } else {
            // Если URL не доступен, создаем его из blob
            img.src = URL.createObjectURL(file.blob);
          }
        });
      }
      
      // Сохраняем PDF
      pdf.save('images.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
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
          <div className="files-header">
            <div>
              <h2>Uploaded Files</h2>
              <p>Drag and drop to reorder files</p>
            </div>
            <button 
              className="generate-pdf-button" 
              onClick={generatePdf}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
          
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
