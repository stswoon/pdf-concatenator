import { useState } from 'react';
import { Button, Stack } from '@mui/material';
import type { FileItemType } from '../types';
import { strings } from "../consts/strings";

interface ActionButtonsProps {
    files: FileItemType[];
    onGeneratePdf: () => void;
    onGenerateZip: () => void;
    onClearAll: () => void;
    isGeneratingPdf: boolean;
    isGeneratingZip: boolean;
}

const ActionButtons = ({
    files,
    onGeneratePdf,
    onGenerateZip,
    onClearAll,
    isGeneratingPdf,
    isGeneratingZip
}: ActionButtonsProps) => {
    const [isHovering, setIsHovering] = useState(false);

    const hasPdfFiles = files.some(file => file.type === 'pdf');
    const hasImageFiles = files.some(file => file.type === 'image');
    const totalPages = files.reduce((sum, file) => sum + (file.pdfPagesNumber || 1), 0);

    return (
        <Stack
            direction="row"
            spacing={2}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {hasPdfFiles && (
                <Button
                    variant="contained"
                    onClick={onGeneratePdf}
                    disabled={isGeneratingPdf || files.length === 0}
                >
                    {isGeneratingPdf ? strings.generatingPdf : strings.generatePdf}
                </Button>
            )}
            {hasImageFiles && (
                <Button
                    variant="contained"
                    onClick={onGenerateZip}
                    disabled={isGeneratingZip || files.length === 0}
                >
                    {isGeneratingZip ? strings.generatingZip : strings.downloadZip}
                </Button>
            )}
            <Button
                variant="outlined"
                onClick={onClearAll}
                disabled={files.length === 0}
            >
                {strings.clearAll}
            </Button>
        </Stack>
    );
};

export default ActionButtons;