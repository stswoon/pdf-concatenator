import './PdfViewer.css';
import {useState} from 'react';
import {Document, Page} from 'react-pdf';
import type {FileItemType} from '../../types';
import {strings} from "../../consts/strings.ts";

interface PdfViewerProps {
    selectedPdf: FileItemType | null;
    onClose: () => void;
}

const PdfViewer = ({selectedPdf, onClose}: PdfViewerProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);

    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (!selectedPdf) return null;

    return (
        <div className="pdf-viewer">
            <Document
                file={selectedPdf.blobUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-document"
            >
                {Array.from(new Array(numPages || 0), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        className="pdf-page"
                        // width={300}
                    />
                ))}
            </Document>
            <div className="pdf-controls">
                <button className="close-pdf-button" onClick={onClose}>{strings.close}</button>
            </div>
        </div>
    );
};

export default PdfViewer;