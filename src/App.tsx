import './App.css';
import {strings} from "./consts/strings.ts";
import useFileManager from "./hooks/useFileManager.ts";
import FileUploader from "./components/FileUploader/FileUploader.tsx";
import PdfViewer from "./components/PdfViewer/PdfViewer.tsx";
import FilesHeader from "./components/FileHeader/FilesHeader.tsx";
import FileList from "./components/FileList/FileList.tsx";
import {pdfjs} from "react-pdf";
import type {FileItemType} from "./types";
import {useState} from "react";
import useExtractPdf from "./hooks/useExtractPdf.ts";

//setup pdfjs worker source
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs';

const App = () => {
    const {
        files,
        addFiles,
        removeFile,
        reorderFiles,
    } = useFileManager();

    const {
        extractImagesFromPdf,
        // isExtractingPdf
    } = useExtractPdf({onExtractImages: addFiles, onRemoveFile: removeFile});

    const [selectedPdf, setSelectedPdf] = useState<FileItemType | null>(null);
    const selectPdf = (file: FileItemType) => setSelectedPdf(file);
    const closePdf = () => setSelectedPdf(null);

    return (
        <div className="app-container">
            <h1>{strings.appName}</h1>

            <FileUploader onFilesAdded={addFiles}/>

            <FilesHeader files={files} />

            <FileList
                files={files}
                onFilesReorder={reorderFiles}
                onRemoveFile={removeFile}
                onPdfSelect={selectPdf}
                onPdfExtract={(fileItem) => extractImagesFromPdf(fileItem)}
            />

            {selectedPdf && (
                <PdfViewer
                    selectedPdf={selectedPdf}
                    onClose={closePdf}
                />
            )}
        </div>
    );
};

export default App;
