import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports generated stickers to a PDF file
 * @param {Array} expandedItems - Array of individual sticker items
 * @param {Object} config - Sticker configuration
 * @param {Function} onProgress - Progress callback (percentage)
 */
export async function exportStickersToPdf(expandedItems, config, onProgress = () => {}) {
  if (!expandedItems || expandedItems.length === 0) {
    throw new Error('No stickers to export.');
  }

  const {
    width = 98,
    height = 44,
    layoutType = 'thermal',
  } = config;

  onProgress(5);

  if (layoutType === 'thermal' || layoutType === 'custom') {
    // Single label per page matching exact label dimensions
    const orientation = width > height ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [width, height],
      compress: true,
    });

    const stickerElements = document.querySelectorAll('.print-sticker-node');

    if (!stickerElements || stickerElements.length === 0) {
      throw new Error('Could not find printable sticker elements in DOM.');
    }

    const total = stickerElements.length;

    for (let i = 0; i < total; i++) {
      const el = stickerElements[i];

      const canvas = await html2canvas(el, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: config.backgroundColor || '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) {
        pdf.addPage([width, height], orientation);
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, width, height, undefined, 'FAST');
      onProgress(Math.round(10 + ((i + 1) / total) * 85));
    }

    onProgress(100);
    pdf.save(`stickers_${width}x${height}mm_${Date.now()}.pdf`);
  } else {
    // A4 Sheet layout PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const sheetElements = document.querySelectorAll('.print-a4-sheet-node');

    if (!sheetElements || sheetElements.length === 0) {
      throw new Error('Could not find printable sheet elements.');
    }

    const total = sheetElements.length;

    for (let i = 0; i < total; i++) {
      const sheet = sheetElements[i];

      const canvas = await html2canvas(sheet, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      onProgress(Math.round(10 + ((i + 1) / total) * 85));
    }

    onProgress(100);
    pdf.save(`stickers_A4_sheet_${Date.now()}.pdf`);
  }
}
