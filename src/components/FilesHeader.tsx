import { Box, Typography, styled } from '@mui/material';
import {strings} from '../consts/strings';

interface FilesHeaderProps {
    filesCount: number;
    pdfCount: number;
    imageCount: number;
}

const HeaderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const StatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
}));

const FilesHeader = ({ filesCount, pdfCount, imageCount }: FilesHeaderProps) => {
    return (
        <HeaderContainer>
            <Typography variant="h5" component="h1">
                {strings.uploadedFiles}
            </Typography>
            <StatsContainer>
                <Typography variant="body2" color="text.secondary">
                    {strings.totalFiles}: {filesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {strings.pdfFiles}: {pdfCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {strings.imageFiles}: {imageCount}
                </Typography>
            </StatsContainer>
        </HeaderContainer>
    );
};

export default FilesHeader;