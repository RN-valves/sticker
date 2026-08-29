import React from 'react';
import { Tag, Sparkles, Download, Trash2, Printer, FileText, Settings2 } from 'lucide-react';
import { downloadSampleExcel } from '../utils/excelParser';

export default function Navbar({
  printerMode = 'thermal',
  onSelectPrinterMode,
  itemCount = 0,
  totalStickers = 0,
  onResetSampleData,
  onClearAll,
  onOpenPrinterSetup,
}) {
  return (
    <header className="no-print bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>StickerPro Studio</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded">
                v2.1
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Thermal Roll & Normal A4 Sticker Generator
            </p>
          </div>
        </div>

        {/* Center: Mode of Choice Switcher (Thermal vs Normal A4) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectPrinterMode('thermal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              printerMode === 'thermal'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Thermal Roll (98×44mm)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPrinterMode('normal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              printerMode === 'normal'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Normal A4 Printer</span>
          </button>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Printer Setup Checklist */}
          <button
            onClick={onOpenPrinterSetup}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-colors"
            title="Printer Connection & Setup Guide"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Printer Guide</span>
          </button>

          {/* Quick Sample Load */}
          <button
            onClick={onResetSampleData}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-500/30 transition-colors"
            title="Load sample retail apparel data"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Sample Data</span>
          </button>

          {/* Template Download */}
          <button
            onClick={downloadSampleExcel}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            title="Download Excel Template"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Template</span>
          </button>

          {/* Clear Data */}
          {itemCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all uploaded items?')) {
                  onClearAll();
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
              title="Clear All Items"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
