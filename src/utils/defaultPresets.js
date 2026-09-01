export const THERMAL_PRESETS = [
  {
    id: 'thermal-98-44',
    name: '98mm × 44mm (RN Official Box Label)',
    type: 'thermal',
    width: 98,
    height: 44,
    unit: 'mm',
    description: 'Exact RN Valves & Faucets product box sticker with safe left padding for thermal printers',
    recommendedFor: 'Thermal Roll (Active)',
  },
  {
    id: 'thermal-50-25',
    name: '50mm × 25mm (Standard 2" × 1")',
    type: 'thermal',
    width: 50,
    height: 25,
    unit: 'mm',
    description: 'Compact barcode roll label',
    recommendedFor: 'Thermal Roll',
  },
  {
    id: 'thermal-75-50',
    name: '75mm × 50mm (3" × 2")',
    type: 'thermal',
    width: 75,
    height: 50,
    unit: 'mm',
    description: 'Medium retail box label & fitting tag',
    recommendedFor: 'Thermal Roll',
  },
];

export const NORMAL_A4_PRESETS = [
  {
    id: 'a4-98-44',
    name: 'A4 Sheet - 98mm × 44mm (2 Columns × 6 Rows = 12 Labels)',
    type: 'a4',
    width: 98,
    height: 44,
    unit: 'mm',
    columns: 2,
    rows: 6,
    marginTop: 16.5,
    marginLeft: 7,
    gapX: 0,
    gapY: 0,
    description: 'Exact 98×44mm RN Valves size tiled on standard A4 paper (12 stickers per sheet)',
    recommendedFor: 'A4 (98×44mm Active)',
  },
];

export const STICKER_PRESETS = [...THERMAL_PRESETS, ...NORMAL_A4_PRESETS];

// Exact Valve & Faucet Sizes
export const EXACT_VALVE_SIZES = [
  '15mm(1/2")',
  '15mm (1/2")',
  '20mm (3/4")',
  '25mm (1")',
  '32mm (1-1/4")',
  '40mm (1-1/2")',
  '50mm (2")',
  '15mm',
  '20mm',
  '1"',
  '1/2"',
  '3/4"',
];

export const COMMON_VALVE_SIZES = EXACT_VALVE_SIZES;

// Popular Valve & Faucet Finishes / Colors
export const COMMON_FINISHES = [
  'Marble',
  'Rose Gold',
  'Matte Black',
  'Chrome Plated (CP)',
  'Antique Brass',
  'Gold Finish',
  'Brass Natural',
  'Graphite Grey',
  'SS Satin',
  'White',
];

export const INITIAL_SAMPLE_DATA = [
  {
    id: 'row-1',
    articleNumber: 'RNG2018B01',
    productName: 'Angle Cock with Flange',
    collection: 'G20 Collection',
    finish: 'Marble',
    color: 'Marble',
    mrp: 572,
    quantity: 1,
    size: '15mm(1/2")',
    batchNo: 'RPK06[AASK](02)',
    mfgDate: 'Jun 2026',
    skuCode: '7646a28acb8c3349',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
  {
    id: 'row-2',
    articleNumber: 'RNG2018B02',
    productName: 'Bib Cock Heavy with Wall Flange',
    collection: 'G20 Collection',
    finish: 'Rose Gold',
    color: 'Rose Gold',
    mrp: 795,
    quantity: 2,
    size: '15mm (1/2")',
    batchNo: 'RPK06[BBSK](01)',
    mfgDate: 'Jun 2026',
    skuCode: '8752b39bdf9d4451',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
  {
    id: 'row-3',
    articleNumber: 'RNBV1025B01',
    productName: 'Brass Ball Valve Heavy Duty',
    collection: 'Elite Brass Collection',
    finish: 'Matte Black',
    color: 'Matte Black',
    mrp: 1150,
    quantity: 4,
    size: '20mm (3/4")',
    batchNo: 'RPK07[BVHD](05)',
    mfgDate: 'Jun 2026',
    skuCode: '9120c48cfe1e5562',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
  {
    id: 'row-4',
    articleNumber: 'RNCV1032B01',
    productName: 'Concealed Stop Cock (Heavy)',
    collection: 'G20 Collection',
    finish: 'Chrome Plated (CP)',
    color: 'Chrome Plated (CP)',
    mrp: 890,
    quantity: 3,
    size: '20mm',
    batchNo: 'RPK08[CSCK](03)',
    mfgDate: 'Jun 2026',
    skuCode: '6543d21bca9a1122',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
  {
    id: 'row-5',
    articleNumber: 'RNPC1015B01',
    productName: 'Pillar Cock High Neck',
    collection: 'G20 Collection',
    finish: 'Antique Brass',
    color: 'Antique Brass',
    mrp: 1480,
    quantity: 2,
    size: '15mm(1/2")',
    batchNo: 'RPK09[PCLK](02)',
    mfgDate: 'Jun 2026',
    skuCode: '3210e76adb2c8899',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
  {
    id: 'row-6',
    articleNumber: 'RNSV1015B01',
    productName: 'Sink Cock with Swivel Spout',
    collection: 'G20 Collection',
    finish: 'Gold Finish',
    color: 'Gold Finish',
    mrp: 1650,
    quantity: 2,
    size: '15mm (1/2")',
    batchNo: 'RPK10[SCGV](01)',
    mfgDate: 'Jun 2026',
    skuCode: '1829f54bca1e7733',
    printStatus: 'pending',
    lastPrintedAt: null,
  },
];

export const DEFAULT_CONFIG = {
  printerMode: 'thermal', // 'thermal' (Roll) | 'normal' (A4 Sheet)
  presetId: 'thermal-98-44',
  width: 98, // in mm
  height: 44, // in mm
  unit: 'mm',
  layoutType: 'thermal', // 'thermal' | 'a4'

  // Safe Margins / Padding
  paddingLeft: 14, // 14mm safe left margin
  paddingRight: 6, // 6mm safe right margin
  paddingTop: 3, // 3mm safe top margin
  paddingBottom: 2.5, // 2.5mm safe bottom margin

  // Default Global Fallbacks
  defaultCollection: 'G20 Collection',
  defaultFinish: 'Marble',
  defaultMfgDate: 'Jun 2026',
  defaultProductName: 'Angle Cock with Flange',
  defaultBatchPrefix: 'RPK06[AASK](02)',

  // A4 specifics locked to 98mm x 44mm (2 columns x 6 rows)
  a4Columns: 2,
  a4Rows: 6,
  a4MarginTop: 16.5,
  a4MarginLeft: 7,
  a4GapX: 0,
  a4GapY: 0,

  // Branding & Logo
  brandName: 'RN VALVES & FAUCETS',
  showLogo: false,
  logoUrl: '',

  // Barcode / QR Code
  barcodeType: 'QR',
  barcodeSource: 'skuCode',
  showBarcodeText: true,

  // Product Fields Visibility & Styling
  showArticleNumber: true,
  articleLabel: 'ART :',

  showMrp: true,
  mrpLabel: 'M.R.P :',
  currencySymbol: '₹',
  showTaxIncludedText: true,
  taxIncludedText: '(Inc. Txs.)',

  showSize: true,
  sizeLabel: 'Size :',

  showQty: true,
  qtyLabel: 'Qty :',

  showBatchNo: true,
  batchLabel: 'Batch No. :',

  showMfgDate: true,
  mfgLabel: 'MFG Date :',

  showFinish: true,
  showCollection: true,
  showProductName: true,

  // Border & Padding
  borderStyle: 'none',
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 0,
  backgroundColor: '#ffffff',
  textColor: '#000000',

  // Printing rule
  expandQuantity: true,
};
