import type {FileItemType as FileItemType} from '../../types';
import './FileItem.css';
import type {DragEvent} from 'react';
import {strings} from "../../consts/strings.ts";

interface FileItemProps {
    file: FileItemType;
    index: number;
    onRemove: (id: string) => void;
    onDragStart: (e: DragEvent, id: string) => void;
    onDragOver: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent, id: string) => void;
    onPdfSelect: (file: FileItemType) => void;
    onPdfExtract: (file: FileItemType) => void;
}

const FileItem = ({
                      file,
                      index,
                      onRemove,
                      onDragStart,
                      onDragOver,
                      onDragLeave,
                      onDrop,
                      onPdfSelect,
                      onPdfExtract
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
            <div className="file-dragger">{strings.dragger}</div>
            <div className="file-info">
                <div className="file-number">{index + 1}</div>
            </div>
            <div className="file-thumbnail">
                {file.type === 'image' ? (
                    <img src={file.blobUrl} alt={file.name} className="image-thumbnail"/>
                ) : (
                    <div className="pdf-thumbnail">
                        <div className="pdf-icon">{strings.PDF}</div>
                        {file.pdfPagesNumber && (
                            <div className="pdf-pages">{file.pdfPagesNumber} {strings.pages}</div>
                        )}
                    </div>
                )}
            </div>
            <div className="file-info">
                <div className="file-name">{file.name}</div>
            </div>
            <div className="file-actions">
                {file.type === 'pdf' && (
                    <>
                        <button
                            className="view-pdf-button"
                            onClick={() => onPdfSelect(file)}
                        >
                            {strings.view}
                        </button>
                        <button
                            className="view-pdf-button"
                            onClick={() => onPdfExtract(file)}
                        >
                            {strings.extract}
                        </button>
                    </>
                )}
                <button
                    className="remove-button"
                    onClick={() => onRemove(file.id)}
                >
                    {strings.remove}
                </button>
            </div>
        </div>
    );
};

export default FileItem;