import React from 'react';
import {
  Printer,
  CheckCircle2,
  AlertTriangle,
  Settings,
  X,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import StickerItem from './StickerItem';

export default function ThermalCalibrationModal({
  isOpen,
  onClose,
  config,
  onPrintTestLabel,
}) {
  if (!isOpen) return null;

  const sampleTestItem = {
    id: 'calibration-test-item',
    articleNumber: 'TEST-9844',
    mrp: 1999,
    quantity: 1,
    size: 'XL',
    skuCode: 'SKU-TEST-9844-XL',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Thermal Printer Setup ({config.width}mm × {config.height}mm)
              </h3>
              <p className="text-xs text-slate-400">
                Ensure zero margins & exact roll alignment for thermal printers (TSC, Zebra, TVS, Xprinter)
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {/* Quick Checklist */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Recommended Browser Print Settings (Ctrl + P)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">1. Paper Size</span>
                <p className="text-slate-200 font-mono font-bold text-sky-400">
                  {config.width}mm × {config.height}mm (or User Defined)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  In your printer driver settings, set paper size to {config.width}mm width and {config.height}mm height.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">2. Margins</span>
                <p className="text-slate-200 font-mono font-bold text-emerald-400">
                  None / 0 mm
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  In Chrome/Edge print dialog, change Margins from "Default" to "None".
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">3. Headers & Footers</span>
                <p className="text-slate-200 font-mono font-bold text-purple-400">
                  Unchecked (Disabled)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Uncheck "Headers and Footers" to prevent browser timestamps from printing on stickers.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">4. Scale</span>
                <p className="text-slate-200 font-mono font-bold text-amber-400">
                  100% / Default
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Set Scale to 100% to keep barcode dimensions 1:1 crisp without blurriness.
                </p>
              </div>
            </div>
          </div>

          {/* Test Sticker Preview */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h5 className="font-bold text-white text-xs">Print 1 Test Label</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Always print 1 test label to check barcode scanning and paper sensor gap before printing a full batch.
              </p>
            </div>
            <button
              onClick={() => {
                onPrintTestLabel();
              }}
              className="shrink-0 flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1 Test Label</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Got It, Close
          </button>
        </div>
      </div>
    </div>
  );
}
