import { useState, type DragEvent } from 'react';
import type { FileItemType } from '../types';
import FileItem from "./FileItem";
import { Box, Paper, Typography, styled, Grid } from '@mui/material';
import {strings} from '../consts/strings';

interface FileListProps {
    files: FileItemType[];
    onMove: (reorderedFiles: FileItemType[]) => void;
    onRemove: (id: string) => void;
    onPdfSelect: (file: FileItemType) => void;
    onPdfExtract: (file: FileItemType) => void;
}

const NoFilesContainer = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    fontStyle: 'italic',
}));

const FileList = ({files, onMove, onRemove, onPdfSelect, onPdfExtract}: FileListProps) => {
    const [draggedItem, setDraggedItem] = useState<FileItemType | null>(null);
    const [dragOverItem, setDragOverItem] = useState<FileItemType | null>(null);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, item: FileItemType) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, item: FileItemType) => {
        e.preventDefault();
        if (draggedItem && draggedItem.id !== item.id) {
            setDragOverItem(item);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>, dropTarget: FileItemType) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.id === dropTarget.id) {
            return;
        }

        const reorderedFiles = [...files];
        const draggedIndex = files.findIndex(file => file.id === draggedItem.id);
        const dropIndex = files.findIndex(file => file.id === dropTarget.id);

        reorderedFiles.splice(draggedIndex, 1);
        reorderedFiles.splice(dropIndex, 0, draggedItem);

        onMove(reorderedFiles);
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItem(null);
    };

    if (files.length === 0) {
        return (
            <NoFilesContainer>
                <Typography variant="body1">
                    {strings.noFiles}
                </Typography>
            </NoFilesContainer>
        );
    }

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            {files.map((file, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                    <FileItem
                        file={file}
                        index={index}
                        onRemove={onRemove}
                        onPdfSelect={onPdfSelect}
                        onPdfExtract={onPdfExtract}
                        onDragStart={(e: DragEvent<HTMLDivElement>) => handleDragStart(e, file)}
                        onDragOver={(e: DragEvent<HTMLDivElement>) => handleDragOver(e, file)}
                        onDrop={(e: DragEvent<HTMLDivElement>) => handleDrop(e, file)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedItem?.id === file.id}
                        isDragOver={dragOverItem?.id === file.id}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default FileList;