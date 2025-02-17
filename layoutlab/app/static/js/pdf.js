// Save to PDF Button event
document.getElementById('saveAsPdfButton').addEventListener('click', () => {
    convertToPDF();
    addLayoutLabFooter(gridContainer);
});

import {
    PDFDocument
} from 'https://cdn.skypack.dev/pdf-lib';

async function convertToPDF() {
    const orientation = document.getElementById('orientationSelect').value;
    const isPortrait = orientation === 'p';

    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    const pageWidth = isPortrait ? A4_WIDTH_MM : A4_HEIGHT_MM;
    const pageHeight = isPortrait ? A4_HEIGHT_MM : A4_WIDTH_MM;

    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a blank page
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Get the container element
    const gridContainerElement = document.getElementById('grid-container');

    // Convert the HTML to a canvas
    const canvas = await html2canvas(gridContainerElement, {
        scale: 2
    });

    // Embed the canvas as an image
    const pngImage = await pdfDoc.embedPng(canvas.toDataURL());

    const pngDims = pngImage.scale(contentWidth / pngImage.width);

    // Draw the image on the PDF
    page.drawImage(pngImage, {
        x: margin,
        y: pageHeight - margin - pngDims.height,
        width: pngDims.width,
        height: pngDims.height,
    });

    // Add footer or any additional content
    const footerText = "LayoutLab Footer";
    page.drawText(footerText, {
        x: margin,
        y: margin / 2,
        size: 10,
        color: rgb(0, 0, 0),
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Trigger download
    const blob = new Blob([pdfBytes], {
        type: 'application/pdf'
    });
    const randomNumber = Math.floor(Math.random() * 1000000);
    const filename = `layoutlab-design-${randomNumber}.pdf`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}