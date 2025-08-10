import './FilesHeader.css';
import type {FileItem as FileItemType} from '../../types';
import {strings} from "../../consts/strings.ts";
import ActionButtons from "../ActionButtons/ActionButtons.tsx";

interface FileHeaderProps {
    files: FileItemType[];
}

const FilesHeader = ({files}: FileHeaderProps) => {
    return (
        <div className="files-header">
            <h2>{strings.uploadedFiles}</h2>
            <ActionButtons files={files}/>
        </div>
    );
};

export default FilesHeader;