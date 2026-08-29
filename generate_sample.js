import * as XLSX from 'xlsx';

const sampleData = [
  {
    'ART': 'RNG2018B01',
    'Product Name': 'Angle Cock with Flange',
    'Collection': 'G20 Collection',
    'Size': '15mm(1/2")',
    'MRP': 572,
    'Finish': 'Marble',
    'Quantity': 1,
    'Batch No': 'RPK06[AASK](02)',
    'MFG Date': 'Jun 2026',
    'sku-code': '7646a28acb8c3349'
  },
  {
    'ART': 'RNG2018B02',
    'Product Name': 'Bib Cock Heavy with Wall Flange',
    'Collection': 'G20 Collection',
    'Size': '15mm (1/2")',
    'MRP': 645,
    'Finish': 'Marble',
    'Quantity': 2,
    'Batch No': 'RPK06[BBSK](01)',
    'MFG Date': 'Jun 2026',
    'sku-code': '8752b39bdf9d4451'
  },
  {
    'ART': 'RNBV1025B01',
    'Product Name': 'Brass Ball Valve Heavy Duty',
    'Collection': 'Elite Brass Collection',
    'Size': '20mm (3/4")',
    'MRP': 1150,
    'Finish': 'Brass Natural',
    'Quantity': 4,
    'Batch No': 'RPK07[BVHD](05)',
    'MFG Date': 'Jun 2026',
    'sku-code': '9120c48cfe1e5562'
  },
  {
    'ART': 'RNCV1032B01',
    'Product Name': 'Concealed Stop Cock (Heavy)',
    'Collection': 'G20 Collection',
    'Size': '20mm',
    'MRP': 890,
    'Finish': 'Chrome Plated',
    'Quantity': 3,
    'Batch No': 'RPK08[CSCK](03)',
    'MFG Date': 'Jun 2026',
    'sku-code': '6543d21bca9a1122'
  },
  {
    'ART': 'RNPC1015B01',
    'Product Name': 'Pillar Cock High Neck',
    'Collection': 'G20 Collection',
    'Size': '15mm(1/2")',
    'MRP': 1280,
    'Finish': 'Marble',
    'Quantity': 2,
    'Batch No': 'RPK09[PCLK](02)',
    'MFG Date': 'Jun 2026',
    'sku-code': '3210e76adb2c8899'
  }
];

const ws = XLSX.utils.json_to_sheet(sampleData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'RN_Box_Stickers');
XLSX.writeFile(wb, 'sample_stickers.xlsx');
XLSX.writeFile(wb, 'rn_valves_template.xlsx');
console.log('Sample Excel files generated with exact RN product sticker layout!');
