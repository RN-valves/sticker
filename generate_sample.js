import XLSX from 'xlsx';

const sampleData = [
  {
    'ART': 'RNG2018B01',
    'Product Name': 'Angle Cock with Flange',
    'Color / Finish': 'Marble',
    'Size': '15mm(1/2")',
    'MRP': 572,
    'Quantity': 1,
    'Collection': 'G20 Collection',
    'Batch No': 'RPK06[AASK](02)',
    'MFG Date': 'Jun 2026',
    'sku-code': '7646a28acb8c3349'
  },
  {
    'ART': 'RNG2018B02',
    'Product Name': 'Bib Cock Heavy with Wall Flange',
    'Color / Finish': 'Rose Gold',
    'Size': '15mm (1/2")',
    'MRP': 795,
    'Quantity': 2,
    'Collection': 'G20 Collection',
    'Batch No': 'RPK06[BBSK](01)',
    'MFG Date': 'Jun 2026',
    'sku-code': '8752b39bdf9d4451'
  },
  {
    'ART': 'RNBV1025B01',
    'Product Name': 'Brass Ball Valve Heavy Duty',
    'Color / Finish': 'Matte Black',
    'Size': '20mm (3/4")',
    'MRP': 1150,
    'Quantity': 4,
    'Collection': 'Elite Brass Collection',
    'Batch No': 'RPK07[BVHD](05)',
    'MFG Date': 'Jun 2026',
    'sku-code': '9120c48cfe1e5562'
  },
  {
    'ART': 'RNCV1032B01',
    'Product Name': 'Concealed Stop Cock (Heavy)',
    'Color / Finish': 'Chrome Plated (CP)',
    'Size': '20mm',
    'MRP': 890,
    'Quantity': 3,
    'Collection': 'G20 Collection',
    'Batch No': 'RPK08[CSCK](03)',
    'MFG Date': 'Jun 2026',
    'sku-code': '6543d21bca9a1122'
  },
  {
    'ART': 'RNPC1015B01',
    'Product Name': 'Pillar Cock High Neck',
    'Color / Finish': 'Antique Brass',
    'Size': '15mm(1/2")',
    'MRP': 1480,
    'Quantity': 2,
    'Collection': 'G20 Collection',
    'Batch No': 'RPK09[PCLK](02)',
    'MFG Date': 'Jun 2026',
    'sku-code': '3210e76adb2c8899'
  },
  {
    'ART': 'RNSV1015B01',
    'Product Name': 'Sink Cock with Swivel Spout',
    'Color / Finish': 'Gold Finish',
    'Size': '15mm (1/2")',
    'MRP': 1650,
    'Quantity': 2,
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
  { wch: 22 }, // Color / Finish
  { wch: 16 }, // Size
  { wch: 10 }, // MRP
  { wch: 10 }, // Quantity
  { wch: 22 }, // Collection
  { wch: 20 }, // Batch No
  { wch: 14 }, // MFG Date
  { wch: 24 }, // sku-code
];

XLSX.writeFile(wb, 'sample_stickers.xlsx');
XLSX.writeFile(wb, 'rn_valves_template.xlsx');

console.log('Sample excel files created successfully with dynamic Color / Finish column!');
