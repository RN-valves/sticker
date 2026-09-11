import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export default function StickerItem({
  item,
  config,
  scale = 1,
  className = '',
  isPrint = false,
}) {
  const {
    width = 98,
    height = 44,
    unit = 'mm',
    defaultCollection = 'G20 Collection',
    defaultFinish = 'Marble',
    defaultProductQty = '1',
    defaultMfgDate = 'Jun 2026',
    defaultProductName = 'Angle Cock with Flange',
    defaultBatchPrefix = 'RPK06[AASK](02)',
    barcodeType = 'QR', // 'QR' | 'CODE128' | 'NONE'
    showBarcodeText = true,
    paddingLeft = 14, // Generous 14mm left space to give ample breathing room & clear any edge/logo
    paddingRight = 6, // 6mm right space
    paddingTop = 3, // 3mm top space
    paddingBottom = 2.5, // 2.5mm bottom space
    borderStyle = 'none',
    borderWidth = 0,
    borderColor = '#000000',
    borderRadius = 0,
  } = config;

  const qrCanvasRef = useRef(null);
  const barcodeSvgRef = useRef(null);

  // Field values with fallbacks
  const collectionName = item.collection || config.defaultCollection || 'G20 Collection';
  
  // DYNAMIC COLOR / FINISH HANDLING
  const finishName = String(item.color || item.finish || config.defaultFinish || 'Marble').trim();
  const finishFontSize = finishName.length > 18 ? '6.8pt' : finishName.length > 12 ? '7.5pt' : '8pt';

  // PRODUCT QUANTITY PRINTED ON THE STICKER (Independent of sticker print copies!)
  // e.g. "1", "1 N", "Pack of 2", "Pack of 3", "2 Pcs"
  const rawProductQty = String(
    item.productQuantity !== undefined && item.productQuantity !== ''
      ? item.productQuantity
      : (item.packOf !== undefined && item.packOf !== ''
          ? item.packOf
          : (config.defaultProductQty || '1'))
  ).trim();

  let formattedQtyDisplay = rawProductQty;
  if (/^\d+$/.test(rawProductQty)) {
    // If user passed just a single digit like 1 or 2, display it cleanly
    formattedQtyDisplay = rawProductQty;
  }

  const mfgDate = item.mfgDate || config.defaultMfgDate || 'Jun 2026';
  const productName = item.productName || item.description || config.defaultProductName || 'Angle Cock with Flange';
  const batchNo = item.batchNo || item.skuCode || config.defaultBatchPrefix || 'RPK06[AASK](02)';
  const artNo = item.articleNumber || 'RNG2018B01';
  const sizeVal = String(item.size !== undefined && item.size !== '' ? item.size : '15mm(1/2")').trim();
  const mrpVal = item.mrp !== undefined && item.mrp !== '' ? item.mrp : 572;
  const qrData = item.skuCode || item.articleNumber || '7646a28acb8c3349';

  // Render QR Code or Barcode
  useEffect(() => {
    if (barcodeType === 'QR' && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        qrData,
        {
          width: 38,
          margin: 0,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.warn('QR Code generation error', err);
        }
      );
    } else if (barcodeType === 'CODE128' && barcodeSvgRef.current) {
      try {
        JsBarcode(barcodeSvgRef.current, qrData, {
          format: 'CODE128',
          width: 1.2,
          height: 22,
          displayValue: false,
          margin: 0,
        });
      } catch (e) {
        console.warn('Barcode error', e);
      }
    }
  }, [qrData, barcodeType]);

  const effPaddingLeft = config.paddingLeft !== undefined && config.paddingLeft >= 4 ? config.paddingLeft : 14;
  const effPaddingRight = config.paddingRight !== undefined ? config.paddingRight : 6;
  const effPaddingTop = config.paddingTop !== undefined ? config.paddingTop : 3;
  const effPaddingBottom = config.paddingBottom !== undefined ? config.paddingBottom : 2.5;

  const containerStyle = {
    width: `${width}${unit}`,
    height: `${height}${unit}`,
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingTop: `${effPaddingTop}${unit}`,
    paddingBottom: `${effPaddingBottom}${unit}`,
    paddingLeft: `${effPaddingLeft}${unit}`,
    paddingRight: `${effPaddingRight}${unit}`,
    border: borderStyle === 'none' ? 'none' : `${borderWidth}px ${borderStyle} ${borderColor}`,
    borderRadius: `${borderRadius}px`,
    boxSizing: 'border-box',
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'top left',
  };

  return (
    <div
      className={`sticker-box relative flex flex-col justify-between overflow-hidden select-none bg-white text-black font-sans ${className}`}
      style={containerStyle}
    >
      {/* ========================================================
          1. TOP 2-COLUMN SPECIFICATION GRID (WITH VERTICAL DIVIDER)
         ======================================================== */}
      <div className="grid grid-cols-2 gap-x-3 w-full leading-tight text-[8pt] border-b border-black/10 pb-1">
        {/* LEFT COLUMN */}
        <div className="flex flex-col space-y-[1.5px] pr-2.5 border-r border-black/50">
          {/* Collection Name */}
          <div className="font-extrabold text-black text-[8.5pt] tracking-tight truncate">
            {collectionName}
          </div>

          {/* Size */}
          <div className="flex items-baseline gap-1 text-[8pt] text-black">
            <span className="font-bold shrink-0">Size :</span>
            <span className="font-bold tracking-tight">{sizeVal}</span>
          </div>

          {/* MRP Price & Taxes */}
          <div className="flex items-baseline gap-1 text-[8pt] text-black">
            <span className="font-bold shrink-0">M.R.P :</span>
            <span className="font-extrabold font-mono">
              ₹ {typeof mrpVal === 'number' ? mrpVal.toLocaleString() : mrpVal}
            </span>
            <span className="text-[6pt] text-black/80 font-normal ml-0.5">(Inc. Txs.)</span>
          </div>

          {/* Batch No. */}
          <div className="flex items-baseline gap-1 text-[7pt] text-black truncate">
            <span className="font-bold shrink-0">Batch No. :</span>
            <span className="font-semibold font-mono tracking-tight truncate">{batchNo}</span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col space-y-[1.5px] pl-2">
          {/* Article / Item Code */}
          <div className="flex items-baseline gap-1 text-[8.5pt] text-black">
            <span className="font-bold shrink-0">ART :</span>
            <span className="font-black font-mono tracking-tight">{artNo}</span>
          </div>

          {/* Dynamic Color / Finish */}
          <div
            className="font-bold text-black tracking-tight truncate leading-tight"
            style={{ fontSize: finishFontSize }}
            title={finishName}
          >
            {finishName}
          </div>

          {/* Product Quantity Printed on Sticker (e.g. 1, 1 N, Pack of 2, Pack of 3) */}
          <div className="flex items-baseline gap-1 text-[8pt] text-black">
            <span className="font-bold shrink-0">Qty :</span>
            <span className="font-bold font-mono tracking-tight">{formattedQtyDisplay}</span>
          </div>

          {/* MFG Date */}
          <div className="flex items-baseline gap-1 text-[7pt] text-black">
            <span className="font-bold shrink-0">MFG Date :</span>
            <span className="font-semibold">{mfgDate}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE SECTION: CENTERED BOLD PRODUCT TITLE
         ======================================================== */}
      <div className="w-full text-center py-1.5 my-auto px-1">
        <h4 className="text-[10pt] font-extrabold tracking-normal text-black font-sans leading-tight">
          {productName}
        </h4>
      </div>

      {/* ========================================================
          3. BOTTOM SECTION: 
             - LEFT: Completely clear pure white space (Reserved for physical pre-printed logo)
             - RIGHT: Code Standard (QR Code or Barcode) + Hash String
         ======================================================== */}
      <div className="flex items-end justify-between w-full pt-0.5 px-0.5 mt-auto">
        {/* Bottom Left: 100% CLEAR BLANK SPACE for physical pre-printed RN logo */}
        <div className="w-14 h-9 shrink-0" />

        {/* Bottom Right: QR Code & Alphanumeric Hash Code */}
        {barcodeType === 'QR' && (
          <div className="flex flex-col items-center shrink-0 pr-1">
            <canvas ref={qrCanvasRef} className="block" />
            {showBarcodeText && (
              <span className="font-mono text-[6pt] text-black font-bold tracking-tighter mt-0.5 leading-none">
                {qrData}
              </span>
            )}
          </div>
        )}

        {/* Fallback to 1D Barcode if selected */}
        {barcodeType === 'CODE128' && (
          <div className="flex flex-col items-center shrink-0 pr-1">
            <svg ref={barcodeSvgRef} className="max-w-[120px]" />
            {showBarcodeText && (
              <span className="font-mono text-[6pt] text-black font-bold tracking-tight">
                {qrData}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
