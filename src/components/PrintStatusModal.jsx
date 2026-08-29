import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  RotateCcw,
  Clock,
  X,
} from 'lucide-react';

export default function PrintStatusModal({
  isOpen,
  onClose,
  printedCount = 0,
  printedItemIds = [],
  onConfirmStatus,
  onReprintFailed,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Print Job Confirmation</h3>
              <p className="text-xs text-slate-400">Track printer success / failure status</p>
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
        <div className="p-6 space-y-4 text-xs text-slate-200">
          <div className="bg-sky-950/30 border border-sky-800/40 p-4 rounded-xl text-center space-y-1">
            <p className="text-sm font-bold text-white">
              Sent <span className="text-sky-400 font-mono">{printedCount} sticker(s)</span> to printer
            </p>
            <p className="text-slate-400 text-xs">
              Did the thermal printer feed and print all labels without errors/jams?
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Success option */}
            <button
              onClick={() => {
                onConfirmStatus(printedItemIds, 'printed');
                onClose();
              }}
              className="w-full group p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/60 flex items-center gap-3.5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-emerald-300 text-xs block">
                  Yes, Printed Successfully
                </span>
                <span className="text-[11px] text-slate-400">
                  Mark items as Printed (Green status)
                </span>
              </div>
            </button>

            {/* Failure / Jam option */}
            <button
              onClick={() => {
                onConfirmStatus(printedItemIds, 'failed');
                onClose();
              }}
              className="w-full group p-3 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-500/60 flex items-center gap-3.5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-rose-300 text-xs block">
                  Failed / Paper Jam / Out of Ribbon
                </span>
                <span className="text-[11px] text-slate-400">
                  Mark items as Failed (Enables 1-click retry reprint)
                </span>
              </div>
            </button>

            {/* Keep as Pending */}
            <button
              onClick={() => {
                onClose();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-center transition-colors text-xs"
            >
              Keep Existing Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
