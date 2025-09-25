import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Box, IconButton, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { FileItemType } from '../types';
import { strings } from '../consts/strings';

interface PdfViewerProps {
    pdfFile: FileItemType;
    onClose: () => void;
}

const PdfViewer = ({ pdfFile, onClose }: PdfViewerProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const changePage = (offset: number) => {
        if (numPages === null) return;
        setPageNumber(prevPageNumber => {
            const newPageNumber = prevPageNumber + offset;
            return Math.max(1, Math.min(newPageNumber, numPages));
        });
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    {pdfFile.name}
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Document
                        file={pdfFile.blobUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={previousPage}
                            disabled={pageNumber <= 1}
                        >
                            <NavigateBeforeIcon />
                        </IconButton>

                        <Typography>
                            Page {pageNumber} of {numPages}
                        </Typography>

                        <IconButton
                            onClick={nextPage}
                            disabled={numPages === null || pageNumber >= numPages}
                        >
                            <NavigateNextIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PdfViewer;