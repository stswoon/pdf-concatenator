import type {FileItemType} from '../types';
import {pdfjs} from "react-pdf";
import {useState} from "react";

interface ExtractPdfProps {
    onExtractImages: (newImages: FileItemType[]) => void;
    onRemoveFile: (id: string) => void
}

const useExtractPdf = ({onExtractImages, onRemoveFile}: ExtractPdfProps) => {
    const [isExtractingPdf, setIsExtractingPdf] = useState(false);

    const extractImagesFromPdf = async (selectedPdf: FileItemType) => {
        if (!selectedPdf) return;

        setIsExtractingPdf(true);

        try {
            const pdf = await pdfjs.getDocument(selectedPdf.blobUrl).promise;
            const numPages = pdf.numPages;

            const newImages: FileItemType[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({scale: 2.0});

                // Создаем canvas для рендеринга страницы
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    // Рендерим страницу на canvas
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;

                    // Конвертируем canvas в PNG
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            newImages.push({
                                id: `${selectedPdf.id}-page-${i}`,
                                name: `${selectedPdf.name.replace('.pdf', '')}-page-${i}.png`,
                                blob: blob,
                                blobUrl: url,
                                type: 'image'
                            });

                            // Если это последняя страница, добавляем все изображения и убираем pdf
                            if (i === numPages) {
                                onExtractImages(newImages);
                                onRemoveFile(selectedPdf.id);
                                setIsExtractingPdf(false);
                            }
                        }
                    }, 'image/png');
                }
            }
        } catch (error) {
            console.error('Error extracting images from PDF:', error);
        } finally {
            setIsExtractingPdf(false)
        }
    };

    return {
        extractImagesFromPdf,
        isExtractingPdf
    };
};

export default useExtractPdf;