import XLSX from 'xlsx';

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
XLSX.utils.book_append_sheet(wb, ws, 'RN_Valves_Stickers');

ws['!cols'] = [
  { wch: 16 }, // ART
  { wch: 34 }, // Product Name
  { wch: 20 }, // Color / Finish
  { wch: 25 }, // Product Qty (On Sticker)
  { wch: 28 }, // Print Copies (Stickers Count)
  { wch: 16 }, // Size
  { wch: 10 }, // MRP
  { wch: 22 }, // Collection
  { wch: 20 }, // Batch No
  { wch: 14 }, // MFG Date
  { wch: 24 }, // sku-code
];

XLSX.writeFile(wb, 'sample_stickers.xlsx');
XLSX.writeFile(wb, 'rn_valves_template.xlsx');

console.log('Sample excel files updated with separate Product Qty and Print Copies successfully!');
