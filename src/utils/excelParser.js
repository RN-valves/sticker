import * as XLSX from 'xlsx';

// Synonym dictionaries for smart column matching
const SYNONYMS = {
  articleNumber: [
    'article number', 'articlenumber', 'article no', 'articleno', 'article_no',
    'article', 'art no', 'art_no', 'artno', 'art', 'item code', 'itemcode', 'item_code',
    'item no', 'item_no', 'itemno', 'style no', 'style_no', 'styleno', 'style', 'product code', 'model'
  ],
  productName: [
    'product name', 'productname', 'item name', 'itemname', 'product', 'item description',
    'description', 'title', 'product title', 'item title', 'product_name', 'name', 'item'
  ],
  finish: [
    'finish', 'color', 'colour', 'colors', 'colours', 'finishes', 'finish type', 'finishtype',
    'shade', 'surface', 'coating', 'material', 'item color', 'item colour', 'product color',
    'product colour', 'color code', 'colour code', 'finish/color', 'color/finish', 'color / finish',
    'finish / color', 'item finish', 'product finish'
  ],
  productQuantity: [
    'product quantity', 'product qty', 'product_qty', 'box qty', 'box quantity', 'item qty',
    'unit qty', 'pack qty', 'pack quantity', 'qty on label', 'label qty', 'pack size',
    'pack of', 'packof', 'package size', 'pack_of', 'units', 'pieces', 'pcs', 'product_quantity'
  ],
  printQuantity: [
    'print quantity', 'print qty', 'print_qty', 'sticker qty', 'stickers count', 'no of stickers',
    'print count', 'copies', 'print copies', 'labels count', 'labels', 'sticker count', 'number of stickers',
    'total stickers', 'print_count', 'copies count'
  ],
  packOf: [
    'pack of', 'packof', 'pack_of', 'pack', 'package', 'package size', 'set of', 'setof',
    'packaging', 'bundle', 'pack_type', 'packing', 'pack_count'
  ],
  mrp: [
    'mrp', 'maximum retail price', 'retail price', 'retailprice', 'price', 'unit price',
    'rate', 'amount', 'selling price', 'sp', 'm.r.p', 'm.r.p.', 'cost'
  ],
  quantity: [
    'quantity', 'qty', 'count', 'print qty', 'no of stickers', 'print count', 'total', 'copies'
  ],
  size: [
    'size', 'dimension', 'valve size', 'item size', 'pipe size', 'diameter', 'sizes', 'measurement', 'fit'
  ],
  collection: [
    'collection', 'collection name', 'series', 'brand line', 'range', 'group'
  ],
  batchNo: [
    'batch no', 'batchno', 'batch_no', 'batch', 'lot', 'lot no', 'lotno', 'lot_no'
  ],
  mfgDate: [
    'mfg date', 'mfgdate', 'mfg_date', 'manufacturing date', 'mfg', 'date', 'month'
  ],
  skuCode: [
    'sku-code', 'sku_code', 'skucode', 'sku code', 'sku', 'barcode', 'barcode no',
    'barcode_no', 'qr code', 'qrcode', 'qr_code', 'hash', 'serial', 'identifier'
  ]
};

/**
 * Normalizes header string for comparison
 */
function normalizeHeader(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Auto-detects matching column name for target fields
 */
export function autoMapColumns(headers) {
  const mapping = {
    articleNumber: '',
    productName: '',
    finish: '',
    productQuantity: '',
    printQuantity: '',
    packOf: '',
    mrp: '',
    quantity: '',
    size: '',
    collection: '',
    batchNo: '',
    mfgDate: '',
    skuCode: ''
  };

  const normalizedHeaders = headers.map(h => ({
    original: h,
    normalized: normalizeHeader(h)
  }));

  for (const [targetKey, synList] of Object.entries(SYNONYMS)) {
    const normalizedSyns = synList.map(s => normalizeHeader(s));

    const matched = normalizedHeaders.find(item =>
      normalizedSyns.includes(item.normalized) ||
      normalizedSyns.some(syn => item.normalized.includes(syn) || syn.includes(item.normalized))
    );

    if (matched) {
      mapping[targetKey] = matched.original;
    }
  }

  return mapping;
}

/**
 * Parses uploaded Excel or CSV file
 */
export async function parseSpreadsheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames.length) {
          throw new Error('Spreadsheet does not contain any sheets.');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (!rawJson.length) {
          throw new Error('Spreadsheet sheet is empty.');
        }

        let headerRowIndex = 0;
        while (headerRowIndex < rawJson.length && (!rawJson[headerRowIndex] || !rawJson[headerRowIndex].some(c => String(c).trim().length > 0))) {
          headerRowIndex++;
        }

        if (headerRowIndex >= rawJson.length) {
          throw new Error('No valid header row found in the spreadsheet.');
        }

        const headers = rawJson[headerRowIndex].map(h => String(h || '').trim()).filter(Boolean);
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex, defval: '' });
        const detectedMapping = autoMapColumns(headers);

        resolve({
          sheetNames: workbook.SheetNames,
          headers,
          rawRows,
          detectedMapping
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Transforms raw spreadsheet rows into normalized sticker items using column mapping
 */
export function transformRowsWithMapping(rawRows, mapping) {
  return rawRows
    .filter(row => {
      const art = mapping.articleNumber ? row[mapping.articleNumber] : '';
      const mrp = mapping.mrp ? row[mapping.mrp] : '';
      const sku = mapping.skuCode ? row[mapping.skuCode] : '';
      const size = mapping.size ? row[mapping.size] : '';
      const prod = mapping.productName ? row[mapping.productName] : '';
      const finish = mapping.finish ? row[mapping.finish] : '';
      return Boolean(art || mrp || sku || size || prod || finish);
    })
    .map((row, index) => {
      const artVal = mapping.articleNumber ? String(row[mapping.articleNumber] || '').trim() : '';
      const prodName = mapping.productName ? String(row[mapping.productName] || '').trim() : '';
      const mrpRaw = mapping.mrp ? row[mapping.mrp] : '';
      const sizeVal = mapping.size !== undefined && mapping.size !== '' ? String(row[mapping.size] !== undefined ? row[mapping.size] : '').trim() : '';
      const collectionVal = mapping.collection ? String(row[mapping.collection] || '').trim() : '';
      
      // Dynamic Color / Finish handling
      let finishVal = '';
      if (mapping.finish && row[mapping.finish] !== undefined) {
        finishVal = String(row[mapping.finish] || '').trim();
      } else {
        const altColorKey = Object.keys(row).find(k => /^(color|colour|finish|shade|material)/i.test(k.trim()));
        if (altColorKey) {
          finishVal = String(row[altColorKey] || '').trim();
        }
      }

      // Dynamic Pack of / Product Qty handling (Physical quantity printed on the sticker!)
      let prodQtyVal = '';
      if (mapping.productQuantity && row[mapping.productQuantity] !== undefined) {
        prodQtyVal = String(row[mapping.productQuantity] || '').trim();
      } else if (mapping.packOf && row[mapping.packOf] !== undefined) {
        prodQtyVal = String(row[mapping.packOf] || '').trim();
      } else {
        const altProdQtyKey = Object.keys(row).find(k => /^(product qty|product quantity|box qty|item qty|unit qty|pack of|pack size)/i.test(k.trim()));
        if (altProdQtyKey) {
          prodQtyVal = String(row[altProdQtyKey] || '').trim();
        }
      }

      // Print Copies (How many physical stickers to print!)
      let printCopiesVal = 1;
      if (mapping.printQuantity && row[mapping.printQuantity] !== undefined) {
        const parsed = parseInt(String(row[mapping.printQuantity]).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) printCopiesVal = parsed;
      } else if (mapping.quantity && row[mapping.quantity] !== undefined && !mapping.productQuantity) {
        // If only generic quantity column was mapped and not productQuantity
        const parsed = parseInt(String(row[mapping.quantity]).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) printCopiesVal = parsed;
      }

      // Fallback: If prodQtyVal is empty, default to '1' or 'Pack of 1'
      if (!prodQtyVal) {
        prodQtyVal = '1';
      }

      const batchVal = mapping.batchNo ? String(row[mapping.batchNo] || '').trim() : '';
      const mfgVal = mapping.mfgDate ? String(row[mapping.mfgDate] || '').trim() : '';
      const skuVal = mapping.skuCode ? String(row[mapping.skuCode] || '').trim() : '';

      const mrpClean = String(mrpRaw).replace(/[^0-9.]/g, '');
      const mrpNum = mrpClean ? parseFloat(mrpClean) : 0;

      return {
        id: `imported-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
        articleNumber: artVal || `RNG2018B0${index + 1}`,
        productName: prodName || 'Angle Cock with Flange',
        collection: collectionVal || 'G20 Collection',
        finish: finishVal || 'Marble',
        color: finishVal || 'Marble',
        productQuantity: prodQtyVal, // Printed on sticker: e.g. "1", "Pack of 2", "Pack of 3", "1 N"
        packOf: prodQtyVal,
        quantity: printCopiesVal, // Number of sticker copies to print!
        printQuantity: printCopiesVal,
        mrp: isNaN(mrpNum) ? 572 : mrpNum,
        size: sizeVal || '15mm(1/2")',
        batchNo: batchVal || skuVal || `RPK06[AASK](${String(index + 1).padStart(2, '0')})`,
        mfgDate: mfgVal || 'Jun 2026',
        skuCode: skuVal || `7646a28acb8c334${index + 1}`,
        printStatus: 'pending',
        lastPrintedAt: null,
      };
    });
}

/**
 * Generates and downloads a sample Excel (.xlsx) file with separate Product Qty and Print Copies
 */
export function downloadSampleExcel() {
  const sampleData = [
    {
      'ART': 'RNG2018B01',
      'Product Name': 'Angle Cock with Flange',
      'Color / Finish': 'Marble',
      'Product Qty (On Sticker)': '1 N',
      'Print Copies (Stickers Count)': 25,
      'Size': '15mm(1/2")',
      'MRP': 572,
      'Collection': 'G20 Collection',
      'Batch No': 'RPK06[AASK](02)',
      'MFG Date': 'Jun 2026',
      'sku-code': '7646a28acb8c3349'
    },
    {
      'ART': 'RNG2018B02',
      'Product Name': 'Bib Cock Heavy with Wall Flange',
      'Color / Finish': 'Rose Gold',
      'Product Qty (On Sticker)': 'Pack of 2',
      'Print Copies (Stickers Count)': 50,
      'Size': '15mm (1/2")',
      'MRP': 795,
      'Collection': 'G20 Collection',
      'Batch No': 'RPK06[BBSK](01)',
      'MFG Date': 'Jun 2026',
      'sku-code': '8752b39bdf9d4451'
    },
    {
      'ART': 'RNBV1025B01',
      'Product Name': 'Brass Ball Valve Heavy Duty',
      'Color / Finish': 'Matte Black',
      'Product Qty (On Sticker)': 'Pack of 3',
      'Print Copies (Stickers Count)': 40,
      'Size': '20mm (3/4")',
      'MRP': 1150,
      'Collection': 'Elite Brass Collection',
      'Batch No': 'RPK07[BVHD](05)',
      'MFG Date': 'Jun 2026',
      'sku-code': '9120c48cfe1e5562'
    },
    {
      'ART': 'RNCV1032B01',
      'Product Name': 'Concealed Stop Cock (Heavy)',
      'Color / Finish': 'Chrome Plated (CP)',
      'Product Qty (On Sticker)': 'Pack of 2',
      'Print Copies (Stickers Count)': 30,
      'Size': '20mm',
      'MRP': 890,
      'Collection': 'G20 Collection',
      'Batch No': 'RPK08[CSCK](03)',
      'MFG Date': 'Jun 2026',
      'sku-code': '6543d21bca9a1122'
    },
    {
      'ART': 'RNPC1015B01',
      'Product Name': 'Pillar Cock High Neck',
      'Color / Finish': 'Antique Brass',
      'Product Qty (On Sticker)': '1 N',
      'Print Copies (Stickers Count)': 20,
      'Size': '15mm(1/2")',
      'MRP': 1480,
      'Collection': 'G20 Collection',
      'Batch No': 'RPK09[PCLK](02)',
      'MFG Date': 'Jun 2026',
      'sku-code': '3210e76adb2c8899'
    },
    {
      'ART': 'RNSV1015B01',
      'Product Name': 'Sink Cock with Swivel Spout',
      'Color / Finish': 'Gold Finish',
      'Product Qty (On Sticker)': 'Pack of 4',
      'Print Copies (Stickers Count)': 15,
      'Size': '15mm (1/2")',
      'MRP': 1650,
      'Collection': 'G20 Collection',
      'Batch No': 'RPK10[SCGV](01)',
      'MFG Date': 'Jun 2026',
      'sku-code': '1829f54bca1e7733'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RN_Box_Stickers');

  ws['!cols'] = [
    { wch: 16 }, // ART
    { wch: 32 }, // Product Name
    { wch: 20 }, // Color / Finish
    { wch: 24 }, // Product Qty (On Sticker)
    { wch: 28 }, // Print Copies (Stickers Count)
    { wch: 16 }, // Size
    { wch: 10 }, // MRP
    { wch: 20 }, // Collection
    { wch: 20 }, // Batch No
    { wch: 14 }, // MFG Date
    { wch: 22 }, // sku-code
  ];

  XLSX.writeFile(wb, 'rn_valves_sticker_template.xlsx');
}

/**
 * Exports current items array to Excel (.xlsx)
 */
export function exportItemsToExcel(items, filename = 'rn_valves_stickers_export.xlsx') {
  const exportData = items.map(item => ({
    'ART': item.articleNumber,
    'Product Name': item.productName || 'Angle Cock with Flange',
    'Color / Finish': item.color || item.finish || 'Marble',
    'Product Qty (On Sticker)': item.productQuantity || item.packOf || '1',
    'Print Copies (Stickers Count)': item.quantity || item.printQuantity || 1,
    'Size': item.size,
    'MRP': item.mrp,
    'Collection': item.collection || 'G20 Collection',
    'Batch No': item.batchNo || item.skuCode || 'RPK06[AASK](02)',
    'MFG Date': item.mfgDate || 'Jun 2026',
    'sku-code': item.skuCode,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Stickers');

  XLSX.writeFile(wb, filename);
}
