import './FileUploader.css';
import {type ChangeEvent, useRef} from 'react';
import type {FileItem} from '../../types';
import {strings} from "../../consts/strings.ts";

interface FileUploaderProps {
    onFilesAdded: (newFiles: FileItem[]) => void;
}

const FileUploader = ({onFilesAdded}: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles: FileItem[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = URL.createObjectURL(file);

                let type: "image" | "pdf" = "pdf";
                if (file.type.startsWith('image/')) {
                    type = 'image';
                } else if (file.type === 'application/pdf') {
                    type = 'pdf';
                } else {
                    throw new Error('Unsupported file type');
                }

                newFiles.push({
                    id: `${Date.now()}-${i}`,
                    type: type,
                    name: file.name,
                    blob: file,
                    blobUrl: url,
                });
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