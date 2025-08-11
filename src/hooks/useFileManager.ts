import {useState} from 'react';
import type {FileItemType} from '../types';

const useFileManager = () => {
    const [files, setFiles] = useState<FileItemType[]>([]);

    //TODO:
    // Очистка URL объектов при размонтировании компонента
    // useEffect(() => {
    //     return () => {
    //         files.forEach(file => {
    //             if (file.blobUrl) {
    //                 console.log("useFileManager unmount")
    //                 URL.revokeObjectURL(file.blobUrl);
    //             }
    //         });
    //     };
    // // TODO: // }, [files]);
    // // }, []);
    // }, [files]);

    const addFiles = (newFiles: FileItemType[], afterFile?: FileItemType) => {
        console.log("newFiles", newFiles)
        if (afterFile) {
            setFiles(prevFiles => {
                const index = prevFiles.findIndex(file => file.id === afterFile.id);
                if (index === -1) return [...prevFiles, ...newFiles];
                return [...prevFiles.slice(0, index + 1), ...newFiles, ...prevFiles.slice(index + 1)];
            });
        } else {
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
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
        console.log("reorderedFiles", reorderedFiles)
        setFiles(reorderedFiles);
    };

    const clearFiles = () => {
        files.forEach(file => {
            if (file.blobUrl) {
                URL.revokeObjectURL(file.blobUrl);
            }
        });
        setFiles([])
    }

    return {
        files,
        addFiles,
        removeFile,
        reorderFiles,
        clearFiles
    };
};

export default useFileManager;