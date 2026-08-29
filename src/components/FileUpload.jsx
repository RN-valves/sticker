import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Download, AlertCircle, FileCheck } from 'lucide-react';
import { parseSpreadsheet, downloadSampleExcel } from '../utils/excelParser';

export default function FileUpload({ onFileParsed, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }

    setErrorMessage(null);

    try {
      const parsedData = await parseSpreadsheet(file);
      onFileParsed({
        ...parsedData,
        fileName: file.name,
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to read spreadsheet.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-sky-500/60 bg-slate-900/50 hover:bg-slate-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-500/20 transition-all">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-white mb-1">
          Upload Excel or CSV Spreadsheet
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4">
          Drag & drop your file here, or <span className="text-sky-400 underline font-medium">browse files</span>. Contains fields: <code className="text-sky-300 font-mono bg-sky-950/60 px-1 py-0.5 rounded text-[11px]">article number</code>, <code className="text-sky-300 font-mono bg-sky-950/60 px-1 py-0.5 rounded text-[11px]">MRP</code>, <code className="text-sky-300 font-mono bg-sky-950/60 px-1 py-0.5 rounded text-[11px]">Quantity</code>, <code className="text-sky-300 font-mono bg-sky-950/60 px-1 py-0.5 rounded text-[11px]">size</code>, <code className="text-sky-300 font-mono bg-sky-950/60 px-1 py-0.5 rounded text-[11px]">sku-code</code>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Supports .XLSX, .XLS, .CSV</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downloadSampleExcel();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 px-3.5 py-1.5 rounded-lg border border-sky-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample Excel Template</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 bg-red-950/40 border border-red-800/50 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
