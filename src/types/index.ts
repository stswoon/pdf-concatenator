export interface FileItemType {
  id: string; // unique id
  type: 'image' | 'pdf'; // uploaded file type
  name: string; //uploaded file name
  blob: Blob; //file data
  blobUrl: string; // URL for image preview (if type is image) and url to pdf (if type is pdf to be able to extract pdf)
  pdfPagesNumber?: number; // count of pages in pdf file (exist only for pdf)
}