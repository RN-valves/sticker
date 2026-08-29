import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import ColumnMapperModal from './components/ColumnMapperModal';
import DataTable from './components/DataTable';
import AddItemModal from './components/AddItemModal';
import StickerDesigner from './components/StickerDesigner';
import StickerPreviewPanel from './components/StickerPreviewPanel';
import StickerItem from './components/StickerItem';
import PrinterSetupModal from './components/PrinterSetupModal';
import PrintStatusModal from './components/PrintStatusModal';
import {
  INITIAL_SAMPLE_DATA,
  DEFAULT_CONFIG,
} from './utils/defaultPresets';
import { transformRowsWithMapping } from './utils/excelParser';
import {
  Layers,
  Sliders,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  HelpCircle,
  Printer,
  Settings2,
} from 'lucide-react';

const STORAGE_KEYS = {
  ITEMS: 'sticker_pro_items_v2',
  CONFIG: 'sticker_pro_config_v2',
};

export default function App() {
  // Load initial items from localStorage or sample fallback
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load items from localStorage', e);
    }
    return INITIAL_SAMPLE_DATA;
  });

  // Load initial config locked to RN Valves & Faucets (98mm x 44mm)
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          brandName: 'RN VALVES & FAUCETS',
          showLogo: false,
          logoUrl: '',
          width: 98,
          height: 44,
          unit: 'mm',
          printerMode: 'thermal',
          layoutType: 'thermal',
        };
      }
    } catch (e) {
      console.warn('Failed to load config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  });

  // Modal states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isPrinterSetupModalOpen, setIsPrinterSetupModalOpen] = useState(false);
  const [isPrintStatusModalOpen, setIsPrintStatusModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [uploadParsedPayload, setUploadParsedPayload] = useState(null);
  const [lastPrintedIds, setLastPrintedIds] = useState([]);
  const [notification, setNotification] = useState(null);
  const [singlePrintItem, setSinglePrintItem] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save items to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config to localStorage', e);
    }
  }, [config]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Switch Printer Mode
  const handleSelectPrinterMode = (mode) => {
    if (mode === 'thermal') {
      setConfig((prev) => ({
        ...prev,
        printerMode: 'thermal',
        layoutType: 'thermal',
        width: 98,
        height: 44,
        unit: 'mm',
        presetId: 'thermal-98-44',
      }));
      showNotification('Switched to Thermal Roll Mode (98mm × 44mm Single Label)');
    } else {
      setConfig((prev) => ({
        ...prev,
        printerMode: 'normal',
        layoutType: 'a4',
        width: 98,
        height: 44,
        unit: 'mm',
        presetId: 'a4-98-44',
        a4Columns: 2,
        a4Rows: 6,
        a4MarginTop: 16.5,
        a4MarginLeft: 7,
      }));
      showNotification('Switched to Normal A4 Printer Mode (98mm × 44mm, 12 Stickers per A4 Sheet)');
    }
  };

  // Upload handler from FileUpload component
  const handleFileParsed = (payload) => {
    const { detectedMapping, rawRows, fileName } = payload;

    const hasArticle = Boolean(detectedMapping.articleNumber);
    const hasMrp = Boolean(detectedMapping.mrp);

    setUploadParsedPayload(payload);

    if (hasArticle && hasMrp) {
      const transformed = transformRowsWithMapping(rawRows, detectedMapping);
      if (transformed.length > 0) {
        setItems(transformed);
        showNotification(`Successfully imported ${transformed.length} items from ${fileName}!`);
      } else {
        setIsColumnModalOpen(true);
      }
    } else {
      setIsColumnModalOpen(true);
    }
  };

  // Confirm column mapping from modal
  const handleConfirmMapping = (mapping) => {
    if (!uploadParsedPayload) return;
    const transformed = transformRowsWithMapping(uploadParsedPayload.rawRows, mapping);
    setItems(transformed);
    setIsColumnModalOpen(false);
    showNotification(`Imported ${transformed.length} items from ${uploadParsedPayload.fileName}!`);
  };

  // Item management
  const handleSaveItem = (item) => {
    if (editingItem) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? item : it)));
      showNotification(`Updated item ${item.articleNumber}`);
    } else {
      setItems((prev) => [item, ...prev]);
      showNotification(`Added item ${item.articleNumber}`);
    }
    setEditingItem(null);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    showNotification('Item deleted', 'info');
  };

  const handleBulkDelete = (ids) => {
    const idSet = new Set(ids);
    setItems((prev) => prev.filter((it) => !idSet.has(it.id)));
    showNotification(`Deleted ${ids.length} items`, 'info');
  };

  const handleDuplicateItem = (item) => {
    const dup = {
      ...item,
      id: `dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      skuCode: `${item.skuCode}-COPY`,
      printStatus: 'pending',
    };
    setItems((prev) => [dup, ...prev]);
    showNotification(`Duplicated item ${item.articleNumber}`);
  };

  const handleResetSampleData = () => {
    setItems(INITIAL_SAMPLE_DATA);
    showNotification('RN Valves & Faucets sample data loaded!');
  };

  const handleClearAll = () => {
    setItems([]);
    showNotification('All sticker items cleared', 'info');
  };

  // Print Status Management (Success / Failed / Pending)
  const handleUpdateStatus = (ids, status) => {
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) => {
        if (idSet.has(item.id)) {
          return {
            ...item,
            printStatus: status,
            lastPrintedAt: status === 'printed' ? now : item.lastPrintedAt,
          };
        }
        return item;
      })
    );
    showNotification(
      status === 'printed'
        ? `Marked ${ids.length} items as Printed (Success)`
        : status === 'failed'
        ? `Marked ${ids.length} items as Failed (Ready for Retry)`
        : `Reset ${ids.length} items to Pending`
    );
  };

  // Triggered when print dialog is opened
  const handlePrintTriggered = (itemIds) => {
    setSinglePrintItem(null);
    setLastPrintedIds(itemIds);
    setTimeout(() => {
      setIsPrintStatusModalOpen(true);
    }, 1200);
  };

  // Print only 1 single sticker
  const handlePrintSingleItem = (item) => {
    setSinglePrintItem(item);
    setLastPrintedIds([item.id]);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setSinglePrintItem(null);
        setIsPrintStatusModalOpen(true);
      }, 1000);
    }, 50);
  };

  // Print specific subset of items
  const handlePrintSpecificItems = (specificItems) => {
    setSinglePrintItem(null);
    setLastPrintedIds(specificItems.map((it) => it.id));
    window.print();
    setTimeout(() => {
      setIsPrintStatusModalOpen(true);
    }, 1200);
  };

  // Print 1 Test label
  const handlePrintTestLabel = () => {
    window.print();
    setIsPrinterSetupModalOpen(false);
  };

  const totalCopies = useMemo(() => {
    return items.reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);
  }, [items]);

  // Expanded items for printing
  const expandedPrintItems = useMemo(() => {
    if (singlePrintItem) {
      return [singlePrintItem];
    }
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
  }, [items, config.expandQuantity, singlePrintItem]);

  // A4 Printable Pages
  const a4PrintPages = useMemo(() => {
    if (config.layoutType !== 'a4' || singlePrintItem) return [];
    const capacityPerPage = (config.a4Columns || 2) * (config.a4Rows || 6);
    const pages = [];
    for (let i = 0; i < expandedPrintItems.length; i += capacityPerPage) {
      pages.push(expandedPrintItems.slice(i, i + capacityPerPage));
    }
    return pages;
  }, [expandedPrintItems, config.layoutType, config.a4Columns, config.a4Rows, singlePrintItem]);

  const isThermal = (config.printerMode || 'thermal') === 'thermal' || Boolean(singlePrintItem);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Screen App Container - Hidden when Printing */}
      <div className="web-app-screen-only min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar
          printerMode={config.printerMode || 'thermal'}
          onSelectPrinterMode={handleSelectPrinterMode}
          itemCount={items.length}
          totalStickers={totalCopies}
          onResetSampleData={handleResetSampleData}
          onClearAll={handleClearAll}
          onOpenPrinterSetup={() => setIsPrinterSetupModalOpen(true)}
        />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
            <div className="bg-slate-900 border border-sky-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
              <span className="text-xs font-semibold">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Upload Section */}
          <section className="no-print">
            <FileUpload onFileParsed={handleFileParsed} />
          </section>

          {/* Studio Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Sticker Designer & Settings (5 cols) */}
            <div className="no-print lg:col-span-5 space-y-6">
              <StickerDesigner
                config={config}
                onChangeConfig={setConfig}
                onOpenCalibrationModal={() => setIsPrinterSetupModalOpen(true)}
              />
            </div>

            {/* Right Column: Live Preview & Data Grid (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Live Sticker Preview Panel */}
              <StickerPreviewPanel
                items={items}
                config={config}
                onOpenAddItem={() => {
                  setEditingItem(null);
                  setIsAddItemModalOpen(true);
                }}
                onOpenCalibrationModal={() => setIsPrinterSetupModalOpen(true)}
                onPrintTriggered={handlePrintTriggered}
                onPrintSingleItem={handlePrintSingleItem}
              />

              {/* Data Management Grid with Print Queue */}
              <div className="no-print">
                <DataTable
                  items={items}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                  onBulkDelete={handleBulkDelete}
                  onAddItem={(item) => {
                    setEditingItem(item);
                    setIsAddItemModalOpen(true);
                  }}
                  onDuplicateItem={handleDuplicateItem}
                  onResetSampleData={handleResetSampleData}
                  onUpdateStatus={handleUpdateStatus}
                  onPrintSpecificItems={handlePrintSpecificItems}
                  currencySymbol={config.currencySymbol}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <ColumnMapperModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          headers={uploadParsedPayload?.headers || []}
          detectedMapping={uploadParsedPayload?.detectedMapping || {}}
          onConfirm={handleConfirmMapping}
          fileName={uploadParsedPayload?.fileName}
          rowCount={uploadParsedPayload?.rawRows?.length || 0}
        />

        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => {
            setIsAddItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          editingItem={editingItem}
        />

        <PrinterSetupModal
          isOpen={isPrinterSetupModalOpen}
          onClose={() => setIsPrinterSetupModalOpen(false)}
          config={config}
          activeMode={config.printerMode || 'thermal'}
          onPrintTestLabel={handlePrintTestLabel}
        />

        <PrintStatusModal
          isOpen={isPrintStatusModalOpen}
          onClose={() => setIsPrintStatusModalOpen(false)}
          printedCount={lastPrintedIds.length}
          printedItemIds={lastPrintedIds}
          onConfirmStatus={handleUpdateStatus}
          onReprintFailed={(ids) => {
            handleUpdateStatus(ids, 'failed');
          }}
        />
      </div>

      {/* ISOLATED PRINTABLE AREA: Rendered ONLY during @media print */}
      <div id="printable-area">
        {!isThermal ? (
          /* Normal A4 Sheet Layout (Tiled 2x6 Grid on 210x297mm A4 Paper) */
          <div className="a4-print-wrapper">
            {a4PrintPages.map((pageItems, pIdx) => (
              <div
                key={`print-a4-page-${pIdx}`}
                className="a4-sheet-page print-a4-sheet-node"
                style={{
                  width: '210mm',
                  height: '297mm',
                  minHeight: '297mm',
                  paddingTop: `${config.a4MarginTop || 16.5}mm`,
                  paddingLeft: `${config.a4MarginLeft || 7}mm`,
                  paddingRight: `${config.a4MarginLeft || 7}mm`,
                  boxSizing: 'border-box',
                  background: '#ffffff',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${config.a4Columns || 2}, ${config.width}${config.unit || 'mm'})`,
                    gridTemplateRows: `repeat(${config.a4Rows || 6}, ${config.height}${config.unit || 'mm'})`,
                    gap: `${config.a4GapY || 0}mm ${config.a4GapX || 0}mm`,
                  }}
                >
                  {pageItems.map((item, itmIdx) => (
                    <div key={`p-item-${pIdx}-${itmIdx}`} className="print-sticker-node">
                      <StickerItem item={item} config={config} isPrint={true} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Thermal Roll Single Page Breaks (1 sticker per feed) */
          <div className="thermal-roll-print-wrapper">
            {expandedPrintItems.map((item, idx) => (
              <div
                key={`thermal-print-${idx}`}
                className="thermal-sticker-page print-sticker-node"
                style={{
                  width: `${config.width}${config.unit || 'mm'}`,
                  height: `${config.height}${config.unit || 'mm'}`,
                  background: '#ffffff',
                  backgroundColor: '#ffffff',
                }}
              >
                <StickerItem item={item} config={config} isPrint={true} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic @page sizing CSS */}
      <style>{`
        @media print {
          @page {
            size: ${
              !isThermal
                ? 'A4 portrait'
                : `${config.width}${config.unit || 'mm'} ${config.height}${config.unit || 'mm'}`
            };
            margin: 0mm !important;
          }
        }
      `}</style>
    </div>
  );
}
