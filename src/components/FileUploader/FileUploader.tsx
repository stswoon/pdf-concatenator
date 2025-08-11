import './FileUploader.css';
import {type ChangeEvent, useRef} from 'react';
import type {FileItemType} from '../../types';
import {strings} from "../../consts/strings.ts"
import { pdfjs } from 'react-pdf';

interface FileUploaderProps {
    onFilesAdded: (newFiles: FileItemType[]) => void;
}

const FileUploader = ({onFilesAdded}: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles: FileItemType[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = URL.createObjectURL(file);

                const newFile: FileItemType = {
                    id: `${Date.now()}-${i}`,
                    type: "image",
                    name: file.name,
                    blob: file,
                    blobUrl: url,
                }

                if (file.type.startsWith('image/')) {
                    newFile.type = 'image';
                } else if (file.type === 'application/pdf') {
                    newFile.type = 'pdf';
                    const pdf = await pdfjs.getDocument(url).promise;
                    newFile.pdfPagesNumber = pdf.numPages;
                } else {
                    throw new Error('Unsupported file type');
                }

                newFiles.push(newFile);
            }

            onFilesAdded(newFiles);
        }

        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-section">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                multiple
                className="file-input"
                id="file-input"
            />
            <label htmlFor="file-input" className="upload-button">{strings.uploadFiles}</label>
        </div>
    );
};

export default FileUploader;