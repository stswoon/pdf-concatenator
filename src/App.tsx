import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import type { FileItemType } from './types';
import FileUploader from './components/FileUploader/FileUploader';
import FilesHeader from './components/FileHeader/FilesHeader';
import FileList from './components/FileList/FileList';
import PdfViewer from './components/PdfViewer/PdfViewer';
import ActionButtons from './components/ActionButtons/ActionButtons';
import useFileManager from './hooks/useFileManager';
import useExtractPdf from './hooks/useExtractPdf';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App = () => {
    const [selectedPdfFile, setSelectedPdfFile] = useState<FileItemType | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isGeneratingZip, setIsGeneratingZip] = useState(false);

    const {
        files,
        addFiles,
        removeFile,
        reorderFiles,
        clearFiles
    } = useFileManager();

    const { extractImagesFromPdf, isExtractingPdf } = useExtractPdf({
        onExtractImages: addFiles,
        onRemoveFile: removeFile
    });

    const handlePdfSelect = (file: FileItemType) => {
        setSelectedPdfFile(file);
    };

    const handlePdfClose = () => {
        setSelectedPdfFile(null);
    };

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            // PDF generation logic here
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleGenerateZip = async () => {
        setIsGeneratingZip(true);
        try {
            // ZIP generation logic here
        } finally {
            setIsGeneratingZip(false);
        }
    };

    const pdfFiles = files.filter((f: FileItemType) => f.type === 'pdf');
    const imageFiles = files.filter((f: FileItemType) => f.type === 'image');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <FileUploader onFilesAdded={addFiles} />
                
                <FilesHeader
                    filesCount={files.length}
                    pdfCount={pdfFiles.length}
                    imageCount={imageFiles.length}
                />

                <FileList
                    files={files}
                    onRemove={removeFile}
                    onPdfSelect={handlePdfSelect}
                    onPdfExtract={extractImagesFromPdf}
                    onMove={reorderFiles}
                />

                <ActionButtons
                    files={files}
                    onGeneratePdf={handleGeneratePdf}
                    onGenerateZip={handleGenerateZip}
                    onClearAll={clearFiles}
                    isGeneratingPdf={isGeneratingPdf}
                    isGeneratingZip={isGeneratingZip}
                />

                {selectedPdfFile && (
                    <PdfViewer
                        pdfFile={selectedPdfFile}
                        onClose={handlePdfClose}
                    />
                )}
            </Container>
        </ThemeProvider>
    );
};

export default App;
