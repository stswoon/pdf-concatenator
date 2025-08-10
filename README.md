# PDF concatenator and splitter

This is tool to concatenate images (jpg, png) and pdf files, and vice versa split pdf to imapges (jpg).

## Plan

1. init vite [V]

```bash
npm create vite@latest my-react-app -- --template react-ts
```

2. install pdf lib [V]

Chosed `jspdf`.

Also interesting one is `pdf-lib`.

Short piace of desision provided in https://medium.com/deno-the-complete-reference/5-useful-npm-packages-for-pdf-processing-in-node-js-c573cee51804

Also ChatGPT answer

| Library                                                     | Main Use Case                                     | Pros                                                                      | Cons                                             |
| ----------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| **[PDF.js](https://mozilla.github.io/pdf.js/)**             | Rendering and reading PDFs                        | Maintained by Mozilla, works fully in browser, good for viewing/searching | Not designed for PDF creation                    |
| **[pdf-lib](https://pdf-lib.js.org/)**                      | Creating and editing PDFs                         | No dependencies, supports browser/Node.js, works with existing PDFs       | More low-level API compared to html2pdf          |
| **[jsPDF](https://github.com/parallax/jsPDF)**              | Generating PDFs from scratch or HTML              | Simple API, HTML → PDF with plugins                                       | Rendering complex HTML/CSS can be limited        |
| **[html2pdf.js](https://github.com/eKoopmans/html2pdf.js)** | Exporting HTML content to PDF                     | Wraps html2canvas + jsPDF, quick DOM export                               | CSS support limited, heavier bundle              |
| **[pdfmake](https://pdfmake.github.io/docs/)**              | Dynamic PDF generation from JSON-like definitions | Styles, tables, images supported; works offline                           | Requires learning its document definition syntax |

3. Upload files + Blob + Drag and drop [V]

```
добавь возможность загрузить список файлов, файлы должны быть выведены в виде списка по порядку, можно менять положение файлов, содержимое файла дожно быть доступно в виде массивов blob, каждый blob это отдельный файл
```

6. Img + Preview [V]

```
поправь код чтобы вместо pdf можно было загружать картинки
```

7. Generate PDF [V]

```
теперь добавь кнопку которая собирает все blob из массива передет ее в библиотеку jspdf, которая каждую картинку кладет на отдельный A4 лист. Затем сгенерированный pdf можно скачать.
```

8. Split PDF

```
добавь возможность разделить pdf на отдельные картинки
```

9. Image Resize in pdf

10. SSG

11. Ad

12. Docker + Deploy

13. Refactor to several files
