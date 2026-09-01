import React, { useState } from 'react';
import {
  Sliders,
  Printer,
  Barcode,
  Tag,
  Type,
  LayoutGrid,
  Sparkles,
  Settings2,
  DollarSign,
  Layers,
  Eye,
  Check,
  FileText,
  Image,
  QrCode,
  Calendar,
  Box,
  MoveHorizontal,
} from 'lucide-react';
import { THERMAL_PRESETS, NORMAL_A4_PRESETS } from '../utils/defaultPresets';

export default function StickerDesigner({
  config,
  onChangeConfig,
  onOpenCalibrationModal,
}) {
  const updateField = (field, value) => {
    onChangeConfig({ ...config, [field]: value });
  };

  const handlePresetSelect = (preset) => {
    onChangeConfig({
      ...config,
      presetId: preset.id,
      width: preset.width,
      height: preset.height,
      unit: preset.unit || 'mm',
      layoutType: preset.type,
      printerMode: preset.type === 'a4' ? 'normal' : 'thermal',
      a4Columns: preset.columns || config.a4Columns,
      a4Rows: preset.rows || config.a4Rows,
      a4MarginTop: preset.marginTop !== undefined ? preset.marginTop : config.a4MarginTop,
      a4MarginLeft: preset.marginLeft !== undefined ? preset.marginLeft : config.a4MarginLeft,
    });
  };

  const isThermal = (config.printerMode || 'thermal') === 'thermal';
  const isCurrent9844 = config.width === 98 && config.height === 44 && isThermal;

  const currentLeftPad = config.paddingLeft !== undefined && config.paddingLeft >= 4 ? config.paddingLeft : 14;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-5 text-xs text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">RN Box Sticker Designer</h3>
            <p className="text-[11px] text-slate-400">Exact 98mm × 44mm Box Label Template</p>
          </div>
        </div>

        <button
          onClick={onOpenCalibrationModal}
          className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-xl border border-amber-500/30 transition-colors"
          title="Printer setup & calibration guide"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Setup Guide</span>
        </button>
      </div>

      {/* Printer Mode Switcher */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <span>Choose Your Printer Mode</span>
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              updateField('printerMode', 'thermal');
              updateField('layoutType', 'thermal');
              updateField('width', 98);
              updateField('height', 44);
              updateField('presetId', 'thermal-98-44');
            }}
            className={`p-2.5 rounded-lg text-left transition-all flex flex-col gap-0.5 ${
              isThermal
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Printer className="w-3.5 h-3.5" />
              <span>Thermal Roll Printer</span>
            </div>
            <span className="text-[10px] opacity-80">98×44mm Single Feed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateField('printerMode', 'normal');
              updateField('layoutType', 'a4');
              updateField('width', 98);
              updateField('height', 44);
              updateField('presetId', 'a4-98-44');
              updateField('a4Columns', 2);
              updateField('a4Rows', 6);
            }}
            className={`p-2.5 rounded-lg text-left transition-all flex flex-col gap-0.5 ${
              !isThermal
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <FileText className="w-3.5 h-3.5" />
              <span>Normal A4 Sheet</span>
            </div>
            <span className="text-[10px] opacity-80">2×6 Grid (12 Labels)</span>
          </button>
        </div>
      </div>

      {/* Featured 98mm x 44mm Status Banner */}
      <div className="p-3.5 rounded-xl border bg-gradient-to-r from-sky-950/60 to-blue-950/60 border-sky-500 ring-1 ring-sky-500/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-xs">
              98mm × 44mm (Safe Margin Active)
            </span>
          </div>
          <span className="text-[10px] bg-sky-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Spacious left margin active ({currentLeftPad}mm) to clear edge cutting!
        </p>
      </div>

      {/* Left Margin / Padding Controls */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Left Space / Margin (Shift Content Right)</span>
          </label>
          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
            {currentLeftPad}mm
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold">Left Spacing Presets:</span>
            <div className="flex items-center gap-1">
              {[
                { label: '10mm', val: 10 },
                { label: '14mm (Recommended)', val: 14 },
                { label: '18mm (More Space)', val: 18 },
                { label: '22mm', val: 22 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => updateField('paddingLeft', p.val)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                    currentLeftPad === p.val
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-400">4mm</span>
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={currentLeftPad}
              onChange={(e) => updateField('paddingLeft', parseInt(e.target.value, 10) || 14)}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">30mm</span>
          </div>
        </div>
      </div>

      {/* Default Global Values */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-sky-400" />
          <span>Product Line & Label Defaults</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Default Collection</span>
            <input
              type="text"
              value={config.defaultCollection || 'G20 Collection'}
              onChange={(e) => updateField('defaultCollection', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-semibold">Default Color / Finish</span>
              <span className="text-[10px] text-sky-400 font-mono">Dynamic per item</span>
            </div>
            <input
              type="text"
              value={config.defaultFinish || 'Marble'}
              onChange={(e) => updateField('defaultFinish', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Marble', 'Rose Gold', 'Matte Black', 'Chrome Plated (CP)', 'Antique Brass', 'Gold Finish'].map((fin) => (
                <button
                  key={fin}
                  type="button"
                  onClick={() => updateField('defaultFinish', fin)}
                  className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
                    (config.defaultFinish || 'Marble') === fin
                      ? 'bg-sky-500 text-white border-sky-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {fin}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Default MFG Date</span>
            <input
              type="text"
              value={config.defaultMfgDate || 'Jun 2026'}
              onChange={(e) => updateField('defaultMfgDate', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Default Product Title</span>
            <input
              type="text"
              value={config.defaultProductName || 'Angle Cock with Flange'}
              onChange={(e) => updateField('defaultProductName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Barcode & QR Code Engine */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-sky-400" />
          <span>Bottom-Right Code Standard</span>
        </label>

        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => updateField('barcodeType', 'QR')}
            className={`p-2 rounded-lg text-center font-bold transition-all ${
              config.barcodeType === 'QR'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            QR Code (Official Box Style)
          </button>
          <button
            type="button"
            onClick={() => updateField('barcodeType', 'CODE128')}
            className={`p-2 rounded-lg text-center font-bold transition-all ${
              config.barcodeType === 'CODE128'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Code128 Barcode
          </button>
        </div>
      </div>
    </div>
  );
}
