import React, { useState } from 'react';
import {
  Printer,
  FileDown,
  Eye,
  Grid,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Settings2,
  FileText,
  Tag,
} from 'lucide-react';
import StickerItem from './StickerItem';
import { exportStickersToPdf } from '../utils/pdfExporter';

export default function StickerPreviewPanel({
  items = [],
  config,
  onOpenAddItem,
  onOpenCalibrationModal,
  onPrintTriggered,
  onPrintSingleItem,
}) {
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'batch'
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.8); // Zoom multiplier for preview
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const isThermal = (config.printerMode || 'thermal') === 'thermal';

  // Expand items based on quantity config
  const expandedItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!config.expandQuantity) return items;

    const list = [];
    items.forEach((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      for (let i = 0; i < qty; i++) {
        list.push({
          ...item,
          copyIndex: i + 1,
          totalCopies: qty,
          instanceId: `${item.id}-copy-${i}`,
        });
      }
    });
    return list;
  }, [items, config.expandQuantity]);

  const activeItem = items[selectedItemIndex] || items[0] || null;

  // Compute A4 pages if layout is A4
  const a4Pages = React.useMemo(() => {
    if (config.layoutType !== 'a4') return [];
    const capacityPerPage = (config.a4Columns || 2) * (config.a4Rows || 6);
    const pages = [];
    for (let i = 0; i < expandedItems.length; i += capacityPerPage) {
      pages.push(expandedItems.slice(i, i + capacityPerPage));
    }
    return pages;
  }, [expandedItems, config.layoutType, config.a4Columns, config.a4Rows]);

  const handlePrintAll = () => {
    window.print();
    if (onPrintTriggered) {
      onPrintTriggered(items.map((it) => it.id));
    }
  };

  const handlePrintActiveSingle = () => {
    if (!activeItem) return;
    if (onPrintSingleItem) {
      onPrintSingleItem(activeItem);
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (expandedItems.length === 0) return;
    try {
      setIsExportingPdf(true);
      setExportProgress(5);
      await exportStickersToPdf(expandedItems, config, (prog) => {
        setExportProgress(prog);
      });
    } catch (err) {
      console.error(err);
      alert(`PDF generation error: ${err.message}`);
    } finally {
      setIsExportingPdf(false);
      setExportProgress(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
          <Eye className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-white">Live Sticker Preview</h4>
        <p className="text-xs text-slate-400 max-w-sm">
          No data uploaded yet. Upload an Excel spreadsheet or click "Sample Data" to preview your RN Valves & Faucets stickers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              {isThermal ? 'Thermal Single Sticker (98mm × 44mm)' : 'A4 Sticker Sheet (98mm × 44mm)'}
            </h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isThermal
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              }`}
            >
              {isThermal
                ? `${expandedItems.length} Thermal Roll Labels`
                : `${expandedItems.length} Stickers (${a4Pages.length} A4 Sheet${a4Pages.length > 1 ? 's' : ''})`}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="font-mono font-semibold text-white">
              {config.width}{config.unit || 'mm'} Length × {config.height}{config.unit || 'mm'} Height
            </span>
            <span>•</span>
            <span className="capitalize font-semibold text-sky-400">
              {isThermal ? '1 Single Sticker Feed Mode' : `Normal A4 (${config.a4Columns || 2}×${config.a4Rows || 6} Grid)`}
            </span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Printer Setup Guide button */}
          <button
            onClick={onOpenCalibrationModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-colors"
            title="Printer Connection & Margin Setup Guide"
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Setup Guide</span>
          </button>

          {/* View mode toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'single'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
            <button
              onClick={() => setViewMode('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'batch'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isThermal ? `Batch (${expandedItems.length})` : `A4 Sheets (${a4Pages.length})`}</span>
            </button>
          </div>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 shadow-md transition-all disabled:opacity-50"
            title="Download vector PDF file"
          >
            <FileDown className="w-4 h-4 text-sky-400" />
            <span>{isExportingPdf ? `${exportProgress}%` : 'PDF'}</span>
          </button>

          {/* Print All button */}
          <button
            onClick={handlePrintAll}
            className={`flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all active:scale-95 ${
              isThermal
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{isThermal ? `Print All (${expandedItems.length})` : 'Print A4 Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] overflow-hidden relative">
        {/* Dimension badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 text-slate-400 border border-slate-800 text-[10px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-2">
          <span>
            Thermal Size: {config.width}mm × {config.height}mm
          </span>
          {isThermal && config.width === 98 && config.height === 44 && (
            <span className="text-emerald-400 font-bold">✓ 1 Single Label / Feed</span>
          )}
        </div>

        {/* Inspector Mode (Single Sticker with zoom + 1-Click Single Print) */}
        {viewMode === 'single' && activeItem && (
          <div className="flex flex-col items-center justify-center space-y-5 w-full py-2">
            {/* Top Single Actions & Zoom */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-xl">
              {/* Quick 1 Single Sticker Print Button */}
              <button
                onClick={handlePrintActiveSingle}
                className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                title="Print only this single 98x44mm sticker to thermal printer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print This 1 Sticker ({activeItem.articleNumber})</span>
              </button>

              {/* Zoom controls */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs text-slate-300">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sky-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.8)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 ml-1 border-l border-slate-700 pl-2"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Sticker Preview Box */}
            <div
              className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center shadow-2xl transition-transform max-w-full overflow-auto"
            >
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
                }}
              >
                <StickerItem item={activeItem} config={config} />
              </div>
            </div>

            {/* Item Navigation bar */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
              <button
                onClick={() => setSelectedItemIndex((i) => Math.max(0, i - 1))}
                disabled={selectedItemIndex === 0}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs text-slate-300">
                Item <span className="font-mono font-bold text-sky-400">{selectedItemIndex + 1}</span> of{' '}
                <span className="font-mono">{items.length}</span> (
                <span className="font-mono text-slate-400">{activeItem.articleNumber}</span> -{' '}
                <span className="text-emerald-400 font-bold">{activeItem.size}</span>)
              </div>
              <button
                onClick={() => setSelectedItemIndex((i) => Math.min(items.length - 1, i + 1))}
                disabled={selectedItemIndex >= items.length - 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Batch Preview Mode */}
        {viewMode === 'batch' && (
          <div className="w-full max-h-[500px] overflow-y-auto p-4 space-y-6">
            {!isThermal ? (
              /* A4 Sheet Batch Layout */
              <div className="space-y-6 flex flex-col items-center">
                {a4Pages.map((pageItems, pageIdx) => (
                  <div
                    key={`page-${pageIdx}`}
                    className="bg-white text-black p-4 rounded-lg shadow-2xl border border-slate-300"
                    style={{
                      width: '210mm',
                      maxWidth: '100%',
                      minHeight: '297mm',
                      boxSizing: 'border-box',
                      paddingTop: `${config.a4MarginTop || 16.5}mm`,
                      paddingLeft: `${config.a4MarginLeft || 7}mm`,
                      paddingRight: `${config.a4MarginLeft || 7}mm`,
                    }}
                  >
                    <div className="text-[10px] text-slate-500 font-mono mb-2 border-b pb-1">
                      A4 Sheet Page {pageIdx + 1} of {a4Pages.length} ({pageItems.length} labels)
                    </div>
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(${config.a4Columns || 2}, minmax(0, 1fr))`,
                        gap: `${config.a4GapY || 0}mm ${config.a4GapX || 0}mm`,
                      }}
                    >
                      {pageItems.map((item, idx) => (
                        <div key={`sheet-${pageIdx}-${idx}`} className="flex justify-center">
                          <StickerItem item={item} config={config} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Continuous Thermal Roll Batch Layout */
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {expandedItems.map((item, idx) => (
                  <div
                    key={`batch-sticker-${idx}`}
                    className="shadow-lg rounded overflow-hidden border border-slate-800 hover:border-sky-500 transition-colors"
                  >
                    <StickerItem item={item} config={config} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
