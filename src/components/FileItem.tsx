import { type DragEvent } from 'react';
import type { FileItemType } from '../types';
import { Box, Paper, IconButton, Typography, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface FileItemProps {
    file: FileItemType;
    index: number;
    onRemove: (id: string) => void;
    onPdfSelect: (file: FileItemType) => void;
    onPdfExtract: (file: FileItemType) => void;
    onDragStart: (e: DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isDragOver: boolean;
}

const ItemContainer = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDragOver'
})<{ isDragging?: boolean; isDragOver?: boolean }>(({ theme, isDragging, isDragOver }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    height: '280px',
    width: '100%',
    backgroundColor: isDragOver ? theme.palette.action.hover : theme.palette.background.paper,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const PreviewContainer = styled(Box)({
    width: '140px',
    height: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const FilePreview = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '4px',
});

const FileInfo = styled(Box)({
    width: '100%',
    marginTop: '8px',
    overflow: 'hidden',
    textAlign: 'center',
});

const FileName = styled(Typography)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '8px',
});

const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    width: '100%',
    marginTop: 'auto',
}));

const FileItem = ({
    file,
    index,
    onRemove,
    onPdfSelect,
    onPdfExtract,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragging,
    isDragOver
}: FileItemProps) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file.blobUrl;
        link.download = file.name;
        link.click();
    };

    return (
        <ItemContainer
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            isDragging={isDragging}
            isDragOver={isDragOver}
        >
            <PreviewContainer>
                {file.type === 'image' ? (
                    <FilePreview src={file.blobUrl} alt={file.name} />
                ) : (
                    <PictureAsPdfIcon sx={{ fontSize: '100px', color: 'text.secondary' }} />
                )}
            </PreviewContainer>
            
            <FileInfo>
                <FileName variant="body1">
                    {index + 1}. {file.name}
                </FileName>
            </FileInfo>

            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 1 }}>
                <DragIndicatorIcon color="action" />
            </Box>

            <ActionButtons>
                {file.type === 'pdf' && (
                    <>
                        <IconButton
                            size="small"
                            onClick={() => onPdfSelect(file)}
                            title="View PDF"
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onPdfExtract(file)}
                            title="Extract PDF pages"
                        >
                            <PictureAsPdfIcon />
                        </IconButton>
                    </>
                )}
                <IconButton
                    size="small"
                    onClick={handleDownload}
                    title="Download file"
                >
                    <FileDownloadIcon />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onRemove(file.id)}
                    title="Remove file"
                >
                    <DeleteIcon />
                </IconButton>
            </ActionButtons>
        </ItemContainer>
    );
};

export default FileItem;