import { useFileManager } from './hooks';
import {
  FileUploader,
  FileList,
  PdfViewer,
  ActionButtons
} from './components';
import './App.css';

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
      <h1>Image Manager</h1>
      
      <FileUploader onFilesAdded={addFiles} />
      
      {selectedPdf ? (
        <PdfViewer
          selectedPdf={selectedPdf}
          onClosePdf={closePdf}
          onExtractImages={addFiles}
        />
      ) : (
        <>
          <div className="files-header">
            <h2>Uploaded Files</h2>
            <ActionButtons files={files} />
          </div>
          
          <FileList
            files={files}
            onFilesReorder={reorderFiles}
            onRemoveFile={removeFile}
            onPdfSelect={selectPdf}
          />
        </>
      )}
    </div>
  );
};

export default App;
