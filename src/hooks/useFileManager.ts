import {useState, useEffect} from 'react';
import type {FileItemType} from '../types';

const useFileManager = () => {
    const [files, setFiles] = useState<FileItemType[]>([]);

    // Очистка URL объектов при размонтировании компонента
    useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file.blobUrl) {
                    URL.revokeObjectURL(file.blobUrl);
                }
            });
        };
    }, [files]);

    const addFiles = (newFiles: FileItemType[]) => {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    const removeFile = (id: string) => {
        setFiles(prevFiles => {
            const fileToRemove = prevFiles.find(file => file.id === id);
            if (fileToRemove && fileToRemove.blobUrl) {
                URL.revokeObjectURL(fileToRemove.blobUrl);
            }
            return prevFiles.filter(file => file.id !== id);
        });
    };

    const reorderFiles = (reorderedFiles: FileItemType[]) => {
        setFiles(reorderedFiles);
    };

    return {
        files,
        addFiles,
        removeFile,
        reorderFiles,
    };
};

export default useFileManager;