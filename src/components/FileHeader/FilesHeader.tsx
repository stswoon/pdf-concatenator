import './FilesHeader.css';
import type {FileItemType as FileItemType} from '../../types';
import {strings} from "../../consts/strings.ts";
import ActionButtons from "../ActionButtons/ActionButtons.tsx";

interface FileHeaderProps {
    files: FileItemType[];
}

const FilesHeader = ({files}: FileHeaderProps) => {
    return (
        <div className="files-header">
            <div className="files-header-title">
                <h2>{strings.uploadedFiles}</h2>
            </div>
            <ActionButtons files={files}/>
        </div>
    );
};

export default FilesHeader;