import './ActionButtons.css';
import {useState} from 'react';
import {jsPDF} from 'jspdf';
import JSZip from 'jszip';
import type {FileItemType} from '../../types';
import {strings} from "../../consts/strings.ts";

interface ActionButtonsProps {
    files: FileItemType[],
    onClearFiles: () => void
}

const isExistPdfInFiles = (files: FileItemType[]) => files.some(file => file.type === 'pdf');


const ActionButtons = ({files, onClearFiles}: ActionButtonsProps) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isGeneratingZip, setIsGeneratingZip] = useState(false);

    const generatePdf = async () => {
        if (files.length === 0 || isGeneratingPdf) return;

        setIsGeneratingPdf(true);

        try {
            const pdf = new jsPDF();
            let currentPage = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.type === 'image') {
                    const img = new Image();
                    img.src = file.blobUrl;

                    await new Promise<void>((resolve, reject) => {
                        img.onload = () => {
                            // Добавляем новую страницу, кроме первого изображения
                            if (currentPage > 0) {
                                pdf.addPage();
                            }

                            //TODO: what value for A4, need check pageWidth, than use ration 0.5-1.2 other leave as is with check box to modify scale

                            // Вычисляем размеры для вписывания изображения в страницу
                            const pageWidth = pdf.internal.pageSize.getWidth();
                            const pageHeight = pdf.internal.pageSize.getHeight();

                            console.log(`pageWidth=${pageWidth}, pageHeight=${pageHeight}`);

                            const imgWidth = img.width;
                            const imgHeight = img.height;

                            let finalWidth = imgWidth;
                            let finalHeight = imgHeight;

                            // Масштабируем изображение, чтобы оно поместилось на странице
                            if (imgWidth > pageWidth || imgHeight > pageHeight) {
                                const ratio = Math.min(
                                    pageWidth / imgWidth,
                                    pageHeight / imgHeight
                                );
                                finalWidth = imgWidth * ratio;
                                finalHeight = imgHeight * ratio;
                            }

                            // Центрируем изображение на странице
                            const x = (pageWidth - finalWidth) / 2;
                            const y = (pageHeight - finalHeight) / 2;

                            // Добавляем изображение в PDF
                            pdf.addImage(
                                img,
                                'JPEG',
                                x,
                                y,
                                finalWidth,
                                finalHeight
                            );

                            currentPage++;
                            resolve();
                        };
                        img.onerror = (cause) => {
                            console.error(`Error loading image '${file.name}', cause:`, cause);
                            reject(cause);
                        };
                    });
                }
            }

            // Сохраняем PDF
            pdf.save('combined_images.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const generateZip = async () => {
        if (files.length === 0 || isGeneratingZip) return;

        setIsGeneratingZip(true);

        try {
            const zip = new JSZip();

            // Добавляем все файлы в ZIP архив
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const response = await fetch(file.blobUrl!);
                const blob = await response.blob();
                zip.file(file.name, blob);
            }

            // Генерируем ZIP архив
            const content = await zip.generateAsync({type: 'blob'});

            // Создаем ссылку для скачивания
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'files.zip';
            link.click();

            // Очищаем ссылку
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error generating ZIP:', error);
        } finally {
            setIsGeneratingZip(false);
        }
    };

    const isGeneratePdfDisabled = () => {
        return files.length === 0 || isGeneratingPdf || isExistPdfInFiles(files);
    }

    //TODO: ability to concat pdf without parse
    const generatePdfTitle = () => isExistPdfInFiles(files) ? strings.disableGeneratePdfBecvauseOfPdf : undefined;

    return (
        <div className="action-buttons">
            <button
                className="generate-pdf-button"
                onClick={onClearFiles}
                disabled={files.length === 0}
            >
                {strings.clear}
            </button>
            <button
                className="generate-pdf-button"
                onClick={generatePdf}
                disabled={isGeneratePdfDisabled()}
                title={generatePdfTitle()}
            >
                {isGeneratingPdf ? strings.generatingPdf : strings.generatePdf}
            </button>
            <button
                className="generate-zip-button"
                onClick={generateZip}
                disabled={files.length === 0 || isGeneratingZip}
            >
                {isGeneratingZip ? strings.generatingZip : strings.donwloadZip}
            </button>
        </div>
    );
};

export default ActionButtons;