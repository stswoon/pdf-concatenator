export interface FileItem {
  id: string; // unique id
  type: 'image' | 'pdf'; // uploaded file type
  name: string; //uploaded file name
  blob: Blob; //file data

  imagePreviewUrl?: string; // URL for image preview (exist only for image)
  pdfPagesNumber?: number; // count of pages in pdf file (exist only for pdf)
}