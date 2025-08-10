import type { FileItem as FileItemType } from '../../types';
import './FileItem.css';

interface FileItemProps {
  file: FileItemType;
  index: number;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onPdfSelect: (file: FileItemType) => void;
}

const FileItem = ({
  file,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onPdfSelect
}: FileItemProps) => {
  return (
    <div
      className="file-item"
      draggable
      onDragStart={(e) => onDragStart(e, file.id)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, file.id)}
    >
      <div className="file-thumbnail">
        {file.type === 'image' ? (
          <img src={file.imagePreviewUrl} alt={file.name} className="image-thumbnail" />
        ) : (
          <div className="pdf-thumbnail">
            <div className="pdf-icon">PDF</div>
            {file.pdfPagesNumber && (
              <div className="pdf-pages">{file.pdfPagesNumber} pages</div>
            )}
          </div>
        )}
      </div>
      <div className="file-info">
        <div className="file-number">{index + 1}</div>
        <div className="file-name">{file.name}</div>
      </div>
      <div className="file-actions">
        {file.type === 'pdf' && (
          <button
            className="view-pdf-button"
            onClick={() => onPdfSelect(file)}
          >
            View & Extract
          </button>
        )}
        <button
          className="remove-button"
          onClick={() => onRemove(file.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default FileItem;