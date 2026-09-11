import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Download,
  Barcode,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  RotateCcw,
  Filter,
  Palette,
  Package,
} from 'lucide-react';
import { exportItemsToExcel } from '../utils/excelParser';
import { INITIAL_SAMPLE_DATA } from '../utils/defaultPresets';

export default function DataTable({
  items = [],
  onUpdateItem,
  onDeleteItem,
  onBulkDelete,
  onAddItem,
  onDuplicateItem,
  onResetSampleData,
  onUpdateStatus,
  onPrintSpecificItems,
  currencySymbol = '₹',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'printed' | 'failed'
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingRowId, setEditingRowId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Status counts
  const counts = useMemo(() => {
    const res = { all: items.length, pending: 0, printed: 0, failed: 0 };
    items.forEach((it) => {
      const s = it.printStatus || 'pending';
      if (res[s] !== undefined) res[s]++;
      else res.pending++;
    });
    return res;
  }, [items]);

  // Filtered rows
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status filter
      const itemStatus = item.printStatus || 'pending';
      if (statusFilter !== 'all' && itemStatus !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (item.articleNumber && item.articleNumber.toLowerCase().includes(q)) ||
          (item.productName && item.productName.toLowerCase().includes(q)) ||
          (item.finish && item.finish.toLowerCase().includes(q)) ||
          (item.color && item.color.toLowerCase().includes(q)) ||
          (item.productQuantity && String(item.productQuantity).toLowerCase().includes(q)) ||
          (item.packOf && String(item.packOf).toLowerCase().includes(q)) ||
          (item.skuCode && item.skuCode.toLowerCase().includes(q)) ||
          (item.size && item.size.toLowerCase().includes(q)) ||
          (item.collection && item.collection.toLowerCase().includes(q)) ||
          String(item.mrp).includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [items, searchQuery, statusFilter]);

  // Statistics: Total physical stickers to print
  const totalStickerCopies = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + (Number(curr.quantity || curr.printQuantity) || 1), 0);
  }, [filteredItems]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((item) => item.id)));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Inline editing
  const startInlineEdit = (item) => {
    setEditingRowId(item.id);
    setEditForm({
      ...item,
      finish: item.color || item.finish || 'Marble',
      productQuantity: item.productQuantity || item.packOf || '1',
      quantity: item.quantity || item.printQuantity || 1,
    });
  };

  const saveInlineEdit = (id) => {
    onUpdateItem({
      ...editForm,
      finish: editForm.finish || 'Marble',
      color: editForm.finish || 'Marble',
      productQuantity: editForm.productQuantity || '1',
      packOf: editForm.productQuantity || '1',
      quantity: Math.max(1, Number(editForm.quantity) || 1),
      printQuantity: Math.max(1, Number(editForm.quantity) || 1),
      mrp: Number(editForm.mrp) || 0,
    });
    setEditingRowId(null);
  };

  const cancelInlineEdit = () => {
    setEditingRowId(null);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} selected item(s)?`)) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.size === 0) return;
    onUpdateStatus(Array.from(selectedIds), newStatus);
    setSelectedIds(new Set());
  };

  const handlePrintSelected = () => {
    const selectedItems = items.filter((it) => selectedIds.has(it.id));
    if (selectedItems.length > 0) {
      onPrintSpecificItems(selectedItems);
    }
  };

  const handlePrintPending = () => {
    const pendingItems = items.filter((it) => (it.printStatus || 'pending') === 'pending');
    if (pendingItems.length > 0) {
      onPrintSpecificItems(pendingItems);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
      {/* Header bar with stats & controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and stats */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Sticker Data & Print Queue</h3>
              <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                {items.length} styles
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-semibold">
                {totalStickerCopies} print labels
              </span>
            </div>
            <p className="text-xs text-slate-400">Product Qty is printed on sticker; Print Copies is how many labels to print</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add item */}
          <button
            onClick={() => onAddItem(null)}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>

          {/* Export to Excel */}
          <button
            onClick={() => exportItemsToExcel(items)}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all"
            title="Export table data to Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          {/* Print Pending Button */}
          {counts.pending > 0 && (
            <button
              onClick={handlePrintPending}
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              title="Print only unprinted/pending items"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pending ({counts.pending})</span>
            </button>
          )}

          {/* Actions on Selected */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              <button
                onClick={handlePrintSelected}
                className="flex items-center gap-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold px-2.5 py-2 rounded-xl border border-sky-500/30"
                title="Print selected items only"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ({selectedIds.size})</span>
              </button>

              <button
                onClick={() => handleBulkStatusChange('printed')}
                className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/30 transition-colors"
                title="Mark Selected as Printed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleBulkStatusChange('failed')}
                className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl border border-rose-500/30 transition-colors"
                title="Mark Selected as Failed (Jammed)"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDeleteSelected}
                className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 hover:border-rose-500/30 transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded-full font-mono">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Pending</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded-full font-mono text-amber-400">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('printed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'printed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Success</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded-full font-mono text-emerald-400">
              {counts.printed}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('failed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'failed'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>Failed</span>
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded-full font-mono text-rose-400">
              {counts.failed}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ART, Title, Color, Pack, Size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-3 w-10 text-center">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-white"
                >
                  {selectedIds.size > 0 && selectedIds.size === filteredItems.length ? (
                    <CheckSquare className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3">#</th>
              <th className="p-3">Status</th>
              <th className="p-3">ART / Article</th>
              <th className="p-3">Product Title</th>
              <th className="p-3">Color / Finish</th>
              <th className="p-3">Box Qty (On Sticker)</th>
              <th className="p-3">Print Copies</th>
              <th className="p-3">MRP ({currencySymbol})</th>
              <th className="p-3">Size</th>
              <th className="p-3">Batch / Hash Code</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-slate-600" />
                    <div>
                      <p className="font-semibold text-slate-300">No sticker items match this filter</p>
                      <p className="text-xs text-slate-500">
                        {statusFilter !== 'all'
                          ? `No items currently marked as "${statusFilter}"`
                          : searchQuery
                          ? 'Try adjusting your search terms'
                          : 'Upload an Excel spreadsheet or load sample demo data'}
                      </p>
                    </div>
                    {statusFilter !== 'all' && (
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="text-xs text-sky-400 underline font-medium"
                      >
                        View All Items ({items.length})
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = selectedIds.has(item.id);
                const isEditing = editingRowId === item.id;
                const status = item.printStatus || 'pending';
                const itemFinish = item.color || item.finish || 'Marble';
                const itemProdQty = item.productQuantity || item.packOf || '1';
                const itemCopies = item.quantity || item.printQuantity || 1;

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-sky-950/20 border-l-2 border-sky-500">
                      <td className="p-3 text-center">
                        <Square className="w-4 h-4 text-slate-600" />
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{index + 1}</td>
                      <td className="p-3">
                        <select
                          value={editForm.printStatus || 'pending'}
                          onChange={(e) =>
                            setEditForm({ ...editForm, printStatus: e.target.value })
                          }
                          className="bg-slate-900 border border-sky-500 rounded px-1.5 py-1 text-xs text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="printed">Success</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.articleNumber}
                          onChange={(e) =>
                            setEditForm({ ...editForm, articleNumber: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.productName}
                          onChange={(e) =>
                            setEditForm({ ...editForm, productName: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.finish}
                          onChange={(e) =>
                            setEditForm({ ...editForm, finish: e.target.value, color: e.target.value })
                          }
                          className="w-full bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.productQuantity}
                          onChange={(e) =>
                            setEditForm({ ...editForm, productQuantity: e.target.value, packOf: e.target.value })
                          }
                          placeholder="e.g. 1, Pack of 2"
                          className="w-24 bg-slate-900 border border-amber-500 rounded px-2 py-1 text-white text-xs font-bold focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          value={editForm.quantity}
                          onChange={(e) =>
                            setEditForm({ ...editForm, quantity: e.target.value, printQuantity: e.target.value })
                          }
                          className="w-16 bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={editForm.mrp}
                          onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                          className="w-20 bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.size}
                          onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                          className="w-20 bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editForm.skuCode}
                          onChange={(e) => setEditForm({ ...editForm, skuCode: e.target.value })}
                          className="w-full bg-slate-900 border border-sky-500 rounded px-2 py-1 text-white font-mono text-xs focus:outline-none"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => saveInlineEdit(item.id)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white px-2 py-1 rounded text-[11px] font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-sky-950/30' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(item.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-slate-500 font-mono">{index + 1}</td>

                    {/* Status Badge & Dropdown */}
                    <td className="p-3">
                      <select
                        value={status}
                        onChange={(e) => onUpdateStatus([item.id], e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          status === 'printed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="pending" className="bg-slate-900 text-amber-400">
                          ⏳ Pending
                        </option>
                        <option value="printed" className="bg-slate-900 text-emerald-400">
                          ✓ Printed
                        </option>
                        <option value="failed" className="bg-slate-900 text-rose-400">
                          ✕ Failed
                        </option>
                      </select>
                    </td>

                    <td className="p-3 font-semibold text-slate-100 font-mono">
                      <span>{item.articleNumber}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-200 text-[11px] truncate max-w-[140px]">
                      {item.productName || item.description || 'Angle Cock with Flange'}
                    </td>
                    <td className="p-3">
                      <span className="bg-sky-950/70 text-sky-300 border border-sky-800/50 text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[120px] inline-block">
                        {itemFinish}
                      </span>
                    </td>
                    {/* Box Qty (Printed ON the sticker) */}
                    <td className="p-3">
                      <span className="bg-amber-950/70 text-amber-300 border border-amber-800/50 text-[11px] font-bold px-2 py-0.5 rounded-md truncate max-w-[110px] inline-block">
                        {itemProdQty}
                      </span>
                    </td>
                    {/* Print Copies (Sticker Count) */}
                    <td className="p-3">
                      <span className="bg-slate-800 text-sky-400 font-mono px-2 py-0.5 rounded border border-slate-700 font-bold">
                        {itemCopies} labels
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-sky-400">
                      {currencySymbol} {typeof item.mrp === 'number' ? item.mrp.toLocaleString() : item.mrp}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-700 font-mono">
                        {item.size}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[11px] truncate max-w-[120px]">
                      {item.skuCode || item.batchNo}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startInlineEdit(item)}
                          className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
                          title="Edit Row"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateItem(item)}
                          className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                          title="Duplicate Row"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
