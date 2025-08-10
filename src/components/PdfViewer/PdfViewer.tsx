import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { FileItem } from '../../types';
import './PdfViewer.css';

// Установка worker для react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.mjs`;

interface PdfViewerProps {
  selectedPdf: FileItem | null;
  onClosePdf: () => void;
  onExtractImages: (newImages: FileItem[]) => void;
}

const PdfViewer = ({ selectedPdf, onClosePdf, onExtractImages }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    
    // Обновляем количество страниц в PDF
    if (selectedPdf) {
      selectedPdf.pdfPages = numPages;
    }
  };

  const extractImagesFromPdf = async () => {
    if (!selectedPdf || !numPages) return;
    
    setIsExtracting(true);
    
    try {
      const newImages: FileItem[] = [];
      const pdf = await pdfjs.getDocument(selectedPdf.url!).promise;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Создаем canvas для рендеринга страницы
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          // Рендерим страницу на canvas
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          // Конвертируем canvas в PNG
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              newImages.push({
                id: `${selectedPdf.id}-page-${i}`,
                name: `${selectedPdf.name.replace('.pdf', '')}-page-${i}.png`,
                blob: blob,
                url: url,
                type: 'image'
              });
              
              // Если это последняя страница, добавляем все изображения
              if (i === numPages) {
                onExtractImages(newImages);
                setIsExtracting(false);
              }
            }
          }, 'image/png');
        }
      }
    } catch (error) {
      console.error('Error extracting images from PDF:', error);
      setIsExtracting(false);
    }
  };

  if (!selectedPdf) return null;

  return (
    <div className="pdf-viewer">
      <Document
        file={selectedPdf.url}
        onLoadSuccess={onDocumentLoadSuccess}
        className="pdf-document"
      >
        {Array.from(new Array(numPages || 0), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="pdf-page"
            width={300}
          />
        ))}
      </Document>
      <div className="pdf-controls">
        <button
          className="extract-images-button"
          onClick={extractImagesFromPdf}
          disabled={isExtracting}
        >
          {isExtracting ? 'Extracting...' : 'Extract Images'}
        </button>
        <button className="close-pdf-button" onClick={onClosePdf}>
          Close PDF
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;