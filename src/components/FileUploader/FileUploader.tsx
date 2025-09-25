import { useRef, type ChangeEvent } from 'react';
import { strings } from "../../consts/strings.ts";
import type { FileItemType } from "../../types";
import { Box, Button, styled } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploaderProps {
    onFilesAdded: (files: FileItemType[]) => void;
}

const UploadContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const HiddenInput = styled('input')({
    display: 'none',
});

const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const uploadedFiles: FileItemType[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const id = crypto.randomUUID();

            if (file.type === 'application/pdf') {
                uploadedFiles.push({
                    id,
                    type: 'pdf',
                    name: file.name,
                    blob: file,
                    blobUrl: URL.createObjectURL(file),
                });
            } else if (file.type.startsWith('image/')) {
                uploadedFiles.push({
                    id,
                    type: 'image',
                    name: file.name,
                    blob: file,
                    blobUrl: URL.createObjectURL(file),
                });
            }
        }

        if (uploadedFiles.length > 0) {
            onFilesAdded(uploadedFiles);
        }

        // Reset input value to allow uploading the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <UploadContainer>
            <HiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileChange}
                id="file-upload"
            />
            <Button
                variant="contained"
                component="label"
                htmlFor="file-upload"
                startIcon={<UploadFileIcon />}
            >
                {strings.uploadFiles}
            </Button>
        </UploadContainer>
    );
};

export default FileUploader;