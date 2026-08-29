import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  AlertTriangle,
  Settings,
  X,
  Sparkles,
  FileText,
  HelpCircle,
  Laptop,
} from 'lucide-react';

export default function PrinterSetupModal({
  isOpen,
  onClose,
  config,
  onPrintTestLabel,
  activeMode = 'thermal',
}) {
  const [activeTab, setActiveTab] = useState(activeMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Printer Connection & Setup Guide
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step instructions for Thermal Roll & Normal A4 Printers
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

        {/* Mode Selector Tabs inside Modal */}
        <div className="px-6 pt-4 pb-0 bg-slate-950/40 border-b border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('thermal')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'thermal'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>1. Thermal Roll Printer (98×44mm & Rolls)</span>
          </button>

          <button
            onClick={() => setActiveTab('normal')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'normal'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Normal Printer (A4 Sticker Sheets)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          {activeTab === 'thermal' ? (
            /* Thermal Printer Instructions */
            <div className="space-y-4">
              <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3.5 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-sky-200 text-xs">For TSC, TVS, Zebra, Xprinter, Gprinter, Rongta</h5>
                  <p className="text-[11px] text-sky-300/80 leading-relaxed mt-0.5">
                    Connect your thermal printer via USB or Bluetooth. Make sure your printer driver is installed in Windows.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Chrome / Edge Print Settings (Ctrl + P)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">1. Destination / Printer</span>
                    <p className="text-slate-200 font-bold text-sky-400">
                      Select your Thermal Printer
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Choose your installed thermal barcode printer.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">2. Paper Size</span>
                    <p className="text-slate-200 font-mono font-bold text-sky-400">
                      {config.width}mm × {config.height}mm (98×44)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      In printer preferences, select or add stock size 98x44mm.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">3. Margins</span>
                    <p className="text-slate-200 font-mono font-bold text-emerald-400">
                      None (0 mm)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Always set Margins to "None" for thermal roll labels.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">4. Headers & Footers</span>
                    <p className="text-slate-200 font-mono font-bold text-purple-400">
                      Unchecked (Disabled)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Prevent date/time text from printing on labels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Print Box */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-white text-xs">Print 1 Thermal Test Label</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Print 1 sample label to verify paper sensor gap and scanner readability.
                  </p>
                </div>
                <button
                  onClick={onPrintTestLabel}
                  className="shrink-0 flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print 1 Test Label</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal A4 Printer Instructions */
            <div className="space-y-4">
              <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3.5 flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-purple-200 text-xs">For HP, Canon, Epson, Brother & Regular Printers</h5>
                  <p className="text-[11px] text-purple-300/80 leading-relaxed mt-0.5">
                    Use standard pre-cut A4 adhesive sticker sheets (e.g. 24 labels/sheet, 30 labels/sheet, 12 labels/sheet).
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>A4 Print Settings (Ctrl + P)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">1. Paper Size</span>
                    <p className="text-slate-200 font-mono font-bold text-purple-400">
                      A4 (210 × 297 mm)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Set paper size to standard A4 sheet paper.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">2. Margins</span>
                    <p className="text-slate-200 font-mono font-bold text-emerald-400">
                      None (0 mm)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Let the dashboard handle exact label grid alignment.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">3. Scale</span>
                    <p className="text-slate-200 font-mono font-bold text-amber-400">
                      100% / Default
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Do not shrink or stretch to maintain label cut accuracy.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block mb-1">4. Headers & Footers</span>
                    <p className="text-slate-200 font-mono font-bold text-sky-400">
                      Unchecked
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ensure page URLs and dates are turned off.
                    </p>
                  </div>
                </div>
              </div>

              {/* Test Print Box */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-white text-xs">Print A4 Alignment Test Page</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Print 1 plain paper test sheet to align with your sticker sheet before peeling.
                  </p>
                </div>
                <button
                  onClick={onPrintTestLabel}
                  className="shrink-0 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Print A4 Test Sheet</span>
                </button>
              </div>
            </div>
          )}
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
