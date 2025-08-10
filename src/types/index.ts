// Типы данных для приложения

export interface FileItem {
  id: string;
  name: string;
  blob: Blob;
  url?: string; // URL для предпросмотра изображения
  type: 'image' | 'pdf'; // Тип файла: изображение или PDF
  pdfPages?: number; // Количество страниц в PDF (если это PDF)
}