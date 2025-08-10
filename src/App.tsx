import './App.css';
import {strings} from "./consts/strings.ts";
import useFileManager from "./hooks/useFileManager.ts";
import FileUploader from "./components/FileUploader/FileUploader.tsx";
import PdfViewer from "./components/PdfViewer/PdfViewer.tsx";
import FilesHeader from "./components/FileHeader/FilesHeader.tsx";
import FileList from "./components/FileList/FileList.tsx";
import {pdfjs} from "react-pdf";

//setup pdfjs worker source
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.mjs';

const App = () => {
    const {
        files,
        selectedPdf,
        addFiles,
        removeFile,
        reorderFiles,
        selectPdf,
        closePdf
    } = useFileManager();

    return (
        <div className="app-container">
            <h1>{strings.appName}</h1>

            <FileUploader onFilesAdded={addFiles}/>

            {selectedPdf && (
                <PdfViewer
                    selectedPdf={selectedPdf}
                    onClose={closePdf}
                    onExtractImages={addFiles}
                />
            )}

            <FilesHeader files={files}/>

            <FileList
                files={files}
                onFilesReorder={reorderFiles}
                onRemoveFile={removeFile}
                onPdfSelect={selectPdf}
            />
        </div>
    );
};

export default App;
