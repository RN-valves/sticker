import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

export default function BarcodeRenderer({
  value,
  type = 'CODE128',
  showText = true,
  height = 30,
  width = 1.4,
  fontSize = 10,
  className = '',
}) {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const textVal = String(value || '').trim();

    if (!textVal) {
      setError('Empty Code');
      return;
    }

    setError(null);

    if (type === 'QR') {
      if (canvasRef.current) {
        QRCode.toCanvas(
          canvasRef.current,
          textVal,
          {
            width: height * 2.2,
            margin: 0,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          },
          (err) => {
            if (err) {
              console.warn('QR Code generation error:', err);
              setError('QR Error');
            }
          }
        );
      }
    } else {
      if (svgRef.current) {
        try {
          let barcodeFormat = 'CODE128';

          if (type === 'EAN13') {
            // EAN13 strictly requires 12 or 13 digits
            if (/^\d{12,13}$/.test(textVal)) {
              barcodeFormat = 'EAN13';
            } else {
              // fallback to Code128
              barcodeFormat = 'CODE128';
            }
          } else if (type === 'UPC') {
            if (/^\d{11,12}$/.test(textVal)) {
              barcodeFormat = 'UPC';
            } else {
              barcodeFormat = 'CODE128';
            }
          }

          JsBarcode(svgRef.current, textVal, {
            format: barcodeFormat,
            width: Math.max(1, width),
            height: Math.max(15, height),
            displayValue: showText,
            fontSize: Math.max(8, fontSize),
            textMargin: 2,
            margin: 0,
            background: 'transparent',
            lineColor: '#000000',
            font: 'monospace',
            fontOptions: 'bold',
          });
        } catch (err) {
          console.warn('JsBarcode render error:', err);
          // Try fallback to standard code128 or display error
          try {
            JsBarcode(svgRef.current, textVal, {
              format: 'CODE128',
              width: Math.max(1, width),
              height: Math.max(15, height),
              displayValue: showText,
              fontSize: Math.max(8, fontSize),
              textMargin: 2,
              margin: 0,
            });
          } catch (e2) {
            setError('Invalid Code Format');
          }
        }
      }
    }
  }, [value, type, showText, height, width, fontSize]);

  if (!value) {
    return <div className="text-[10px] text-red-500 font-mono italic">No Code</div>;
  }

  if (error) {
    return (
      <div className="text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 border border-amber-200 rounded font-mono text-center">
        {error}: {value}
      </div>
    );
  }

  if (type === 'QR') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <canvas ref={canvasRef} className="max-w-full" />
        {showText && (
          <span className="text-[8px] font-mono font-bold tracking-tight text-black mt-0.5 max-w-full truncate">
            {value}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center overflow-hidden max-w-full ${className}`}>
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  );
}
