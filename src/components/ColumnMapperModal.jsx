import React, { useState, useEffect } from 'react';
import { Columns, CheckCircle2, AlertCircle, ArrowRight, X } from 'lucide-react';

export default function ColumnMapperModal({
  isOpen,
  onClose,
  headers = [],
  detectedMapping = {},
  onConfirm,
  fileName = 'Uploaded Spreadsheet',
  rowCount = 0,
}) {
  const [mapping, setMapping] = useState({
    articleNumber: '',
    mrp: '',
    quantity: '',
    size: '',
    skuCode: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMapping({
        articleNumber: detectedMapping.articleNumber || '',
        mrp: detectedMapping.mrp || '',
        quantity: detectedMapping.quantity || '',
        size: detectedMapping.size || '',
        skuCode: detectedMapping.skuCode || '',
      });
    }
  }, [isOpen, detectedMapping]);

  if (!isOpen) return null;

  const targetFields = [
    {
      key: 'articleNumber',
      label: 'Article Number / Style No',
      required: true,
      description: 'Product identifier, style code, or article number (e.g. ART-9021)',
    },
    {
      key: 'mrp',
      label: 'MRP (Maximum Retail Price)',
      required: true,
      description: 'Product price number (e.g. 1499, ₹1,499.00)',
    },
    {
      key: 'quantity',
      label: 'Quantity (Print Copies)',
      required: false,
      description: 'Number of sticker labels to print for this row (defaults to 1 if blank)',
    },
    {
      key: 'size',
      label: 'Size / Dimension',
      required: false,
      description: 'Garment or item size (e.g. S, M, L, XL, 32, UK 9, Free Size)',
    },
    {
      key: 'skuCode',
      label: 'SKU Code / Barcode Data',
      required: false,
      description: 'Unique SKU code encoded into the barcode or QR code',
    },
  ];

  const handleSelectChange = (fieldKey, value) => {
    setMapping((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleConfirm = () => {
    onConfirm(mapping);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Map Spreadsheet Columns
              </h3>
              <p className="text-xs text-slate-400">
                {fileName} • {rowCount} rows detected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-200 leading-relaxed">
              We automatically matched your spreadsheet headers. Verify or adjust the mappings below to match your Excel columns with the sticker fields.
            </p>
          </div>

          <div className="space-y-3">
            {targetFields.map((field) => {
              const isMapped = Boolean(mapping[field.key]);
              return (
                <div
                  key={field.key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isMapped
                      ? 'bg-slate-800/60 border-slate-700'
                      : field.required
                      ? 'bg-amber-950/20 border-amber-800/40'
                      : 'bg-slate-800/30 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-200">
                          {field.label}
                        </span>
                        {field.required ? (
                          <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Optional</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{field.description}</p>
                    </div>

                    <div className="sm:w-56">
                      <select
                        value={mapping[field.key]}
                        onChange={(e) => handleSelectChange(field.key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                      >
                        <option value="">-- Do Not Import / Auto --</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>
                            Excel: {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all"
          >
            <span>Import & Generate Stickers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
