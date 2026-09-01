import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, X, Check, Palette } from 'lucide-react';
import { EXACT_VALVE_SIZES, COMMON_FINISHES } from '../utils/defaultPresets';

export default function AddItemModal({ isOpen, onClose, onSave, editingItem = null }) {
  const [formData, setFormData] = useState({
    articleNumber: 'RNG2018B01',
    productName: 'Angle Cock with Flange',
    collection: 'G20 Collection',
    finish: 'Marble',
    mrp: 572,
    quantity: 1,
    size: '15mm(1/2")',
    batchNo: 'RPK06[AASK](02)',
    mfgDate: 'Jun 2026',
    skuCode: '7646a28acb8c3349',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          articleNumber: editingItem.articleNumber || '',
          productName: editingItem.productName || 'Angle Cock with Flange',
          collection: editingItem.collection || 'G20 Collection',
          finish: editingItem.color || editingItem.finish || 'Marble',
          mrp: editingItem.mrp || 572,
          quantity: editingItem.quantity || 1,
          size: editingItem.size || '15mm(1/2")',
          batchNo: editingItem.batchNo || 'RPK06[AASK](02)',
          mfgDate: editingItem.mfgDate || 'Jun 2026',
          skuCode: editingItem.skuCode || '7646a28acb8c3349',
        });
      } else {
        setFormData({
          articleNumber: 'RNG2018B01',
          productName: 'Angle Cock with Flange',
          collection: 'G20 Collection',
          finish: 'Marble',
          mrp: 572,
          quantity: 1,
          size: '15mm(1/2")',
          batchNo: 'RPK06[AASK](02)',
          mfgDate: 'Jun 2026',
          skuCode: '7646a28acb8c3349',
        });
      }
      setErrors({});
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.articleNumber.trim()) {
      newErrors.articleNumber = 'ART / Article number is required';
    }
    if (formData.mrp === '' || isNaN(Number(formData.mrp)) || Number(formData.mrp) < 0) {
      newErrors.mrp = 'Please enter a valid MRP price';
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const itemToSave = {
      id: editingItem ? editingItem.id : `manual-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      articleNumber: formData.articleNumber.trim(),
      productName: formData.productName.trim() || 'Angle Cock with Flange',
      collection: formData.collection.trim() || 'G20 Collection',
      finish: formData.finish.trim() || 'Marble',
      color: formData.finish.trim() || 'Marble',
      mrp: Number(formData.mrp),
      quantity: Number(formData.quantity),
      size: formData.size.trim() || '15mm(1/2")',
      batchNo: formData.batchNo.trim() || 'RPK06[AASK](02)',
      mfgDate: formData.mfgDate.trim() || 'Jun 2026',
      skuCode: formData.skuCode.trim() || '7646a28acb8c3349',
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              {editingItem ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit RN Box Sticker Item' : 'Add RN Box Sticker Item'}
              </h3>
              <p className="text-xs text-slate-400">Exact RN Valves & Faucets product box label fields</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Product Title / Name (Centered on Sticker) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Angle Cock with Flange, Brass Ball Valve"
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Article Number / ART */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                ART : (Article No.) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. RNG2018B01"
                value={formData.articleNumber}
                onChange={(e) => handleChange('articleNumber', e.target.value)}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.articleNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
                }`}
              />
              {errors.articleNumber && <p className="text-[11px] text-rose-400">{errors.articleNumber}</p>}
            </div>

            {/* Collection Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Collection Name
              </label>
              <input
                type="text"
                placeholder="e.g. G20 Collection"
                value={formData.collection}
                onChange={(e) => handleChange('collection', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* Dynamic Color / Finish */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Color / Finish (Dynamic on Sticker Line 2)</span>
                </label>
                <span className="text-[10px] text-slate-400">e.g. Marble, Rose Gold, CP, Black</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Marble, Rose Gold, Chrome Plated (CP), Matte Black"
                value={formData.finish}
                onChange={(e) => handleChange('finish', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
              {/* Quick Color / Finish Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {COMMON_FINISHES.map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    onClick={() => handleChange('finish', fin)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition-all ${
                      formData.finish === fin
                        ? 'bg-sky-500 text-white border-sky-400 font-bold shadow-md shadow-sky-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {fin}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                Size : (e.g. 15mm(1/2"), 20mm(3/4"), 1", 1/2", 3/4)
              </label>
              <input
                type="text"
                placeholder="e.g. 15mm(1/2'')"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
              {/* Quick Size Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {EXACT_VALVE_SIZES.slice(0, 10).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleChange('size', sz)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-mono transition-all ${
                      formData.size === sz
                        ? 'bg-sky-500 text-white border-sky-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* MRP */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                M.R.P (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="any"
                placeholder="572"
                value={formData.mrp}
                onChange={(e) => handleChange('mrp', e.target.value)}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  errors.mrp ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500'
                }`}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Qty (Copies) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* MFG Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                MFG Date
              </label>
              <input
                type="text"
                placeholder="e.g. Jun 2026"
                value={formData.mfgDate}
                onChange={(e) => handleChange('mfgDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* Batch No */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Batch No.
              </label>
              <input
                type="text"
                placeholder="e.g. RPK06[AASK](02)"
                value={formData.batchNo}
                onChange={(e) => handleChange('batchNo', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* QR Code / Serial Hash */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                QR Code / Serial Hash String
              </label>
              <input
                type="text"
                placeholder="e.g. 7646a28acb8c3349"
                value={formData.skuCode}
                onChange={(e) => handleChange('skuCode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editingItem ? 'Update Sticker' : 'Add Sticker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
