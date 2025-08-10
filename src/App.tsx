import { useState, useRef, useCallback, useEffect, type DragEvent } from 'react'
import { jsPDF } from "jspdf";
import { Document, Page, pdfjs } from 'react-pdf';
import JSZip from 'jszip';
import './App.css'

// Инициализация worker для react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
//TODO: copy pdf.worker.min.mjs to public folder from node_modules/pdfjs-dist/build/



interface FileItem {
  id: string;
  name: string;
  blob: Blob;
  url?: string; // URL для предпросмотра изображения
  type: 'image' | 'pdf'; // Тип файла: изображение или PDF
  pdfPages?: number; // Количество страниц в PDF (если это PDF)
}

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedItem, setDraggedItem] = useState<FileItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Состояния для работы с PDF
  const [selectedPdf, setSelectedPdf] = useState<FileItem | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isExtractingImages, setIsExtractingImages] = useState<boolean>(false);

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
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  
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
  
  // Функция для обработки выбора PDF файла
  const handlePdfSelect = (file: FileItem) => {
    if (file.type === 'pdf') {
      setSelectedPdf(file);
    }
  };

  // Функция для обработки загрузки PDF документа
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (selectedPdf) {
      // Обновляем информацию о количестве страниц в PDF
      const updatedFiles = files.map(file => 
        file.id === selectedPdf.id ? { ...file, pdfPages: numPages } : file
      );
      setFiles(updatedFiles);
    }
  };

  // Функция для извлечения изображений из PDF
  const extractImagesFromPdf = async () => {
    if (!selectedPdf || isExtractingImages) return;
    
    setIsExtractingImages(true);
    
    try {
      const newImages: FileItem[] = [];
      const pdf = await pdfjs.getDocument(selectedPdf.url!).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Создаем canvas для рендеринга страницы
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Рендерим страницу на canvas
        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise;
        
        // Конвертируем canvas в изображение
        const imgData = canvas.toDataURL('image/png');
        
        // Конвертируем Data URL в Blob
        const response = await fetch(imgData);
        const blob = await response.blob();
        
        // Создаем URL для предпросмотра
        const url = URL.createObjectURL(blob);
        
        // Добавляем новое изображение в список
        newImages.push({
          id: `${selectedPdf.id}-page-${i}`,
          name: `${selectedPdf.name.replace('.pdf', '')}-page-${i}.png`,
          blob: blob,
          url: url,
          type: 'image'
        });
      }
      
      // Добавляем новые изображения в список файлов
      setFiles([...files, ...newImages]);
      
      // Сбрасываем выбранный PDF
      setSelectedPdf(null);
      
    } catch (error) {
      console.error('Error extracting images from PDF:', error);
      alert('Failed to extract images from PDF. Please try again.');
    } finally {
      setIsExtractingImages(false);
    }
  };

  // Функция для создания и скачивания ZIP-архива со всеми файлами
  const generateZip = async () => {
    if (files.length === 0 || isGeneratingZip) return;
    
    setIsGeneratingZip(true);
    
    try {
      const zip = new JSZip();
      
      // Добавляем каждый файл в архив
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Добавляем файл в архив с его именем
        zip.file(file.name, file.blob);
      }
      
      // Генерируем ZIP-архив
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'files.zip';
      
      // Имитируем клик для скачивания
      document.body.appendChild(link);
      link.click();
      
      // Удаляем ссылку
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Failed to generate ZIP. Please try again.');
    } finally {
      setIsGeneratingZip(false);
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
          accept="image/*,application/pdf" 
          multiple 
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-button">
          Upload Images
        </label>
      </div>
      
      {selectedPdf && (
        <div className="pdf-viewer">
          <h2>PDF Preview: {selectedPdf.name}</h2>
          <Document
            file={selectedPdf.url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="pdf-document"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                scale={0.5}
                className="pdf-page"
              />
            ))}
          </Document>
          <button 
            className="extract-images-button" 
            onClick={extractImagesFromPdf}
            disabled={isExtractingImages}
          >
            {isExtractingImages ? 'Extracting Images...' : 'Extract Images from PDF'}
          </button>
          <button 
            className="close-pdf-button" 
            onClick={() => setSelectedPdf(null)}
          >
            Close PDF Preview
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="files-list">
          <div className="files-header">
            <div>
              <h2>Uploaded Files</h2>
              <p>Drag and drop to reorder files</p>
            </div>
            <div className="action-buttons">
              <button 
                className="generate-pdf-button" 
                onClick={generatePdf}
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? 'Generating...' : 'Generate PDF'}
              </button>
              <button 
                className="generate-zip-button" 
                onClick={generateZip}
                disabled={isGeneratingZip}
              >
                {isGeneratingZip ? 'Generating...' : 'Download ZIP'}
              </button>
            </div>
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
                    {file.type === 'image' ? (
                      <img src={file.url} alt={file.name} />
                    ) : (
                      <div className="pdf-thumbnail" onClick={() => handlePdfSelect(file)}>
                        <span className="pdf-icon">PDF</span>
                        {file.pdfPages && <span className="pdf-pages">{file.pdfPages} pages</span>}
                      </div>
                    )}
                  </div>
                )}
                <div className="file-info">
                  <span className="file-number">{index + 1}</span>
                  <span className="file-name">{file.name}</span>
                  {file.type === 'pdf' && (
                    <button 
                      className="view-pdf-button" 
                      onClick={() => handlePdfSelect(file)}
                    >
                      View & Extract
                    </button>
                  )}
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
