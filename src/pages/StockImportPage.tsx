/**
 * Stock Import Page — daily CSV feed uploader
 *
 * Expected CSV columns (case-insensitive):
 *   sku, cost_price (or price), stock_qty (or stock / quantity), weight_kg (optional)
 *
 * On import:
 *  1. Parses the CSV in the browser
 *  2. Matches rows to existing products by SKU
 *  3. Updates cost price (price field), stock_qty, and weight_kg
 *  4. Previews changes before applying to session state
 */
import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';
import { applyMargin, MARGIN_RATE } from '@/lib/pricing';
import type { Product } from '@/types/product';

interface CsvRow {
  sku: string;
  cost_price: number | null;
  stock_qty: number | null;
  weight_kg: number | null;
}

interface ImportResult {
  matched: number;
  unmatched: string[];
  updates: Array<{
    sku: string;
    name: string;
    oldCost: number | null;
    newCost: number | null;
    oldStock: number | undefined;
    newStock: number | null;
    oldWeight: number | undefined;
    newWeight: number | null;
  }>;
}

function parseNum(v: string | undefined): number | null {
  if (!v || v.trim() === '') return null;
  const n = parseFloat(v.replace(/[£$€,\s]/g, ''));
  return isNaN(n) ? null : n;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  const colIdx = (names: string[]) => {
    for (const n of names) { const i = headers.indexOf(n); if (i >= 0) return i; }
    return -1;
  };

  const skuIdx    = colIdx(['sku', 'product_sku', 'item_sku']);
  const priceIdx  = colIdx(['cost_price', 'cost', 'price', 'unit_cost']);
  const stockIdx  = colIdx(['stock_qty', 'stock', 'quantity', 'qty', 'available_qty']);
  const weightIdx = colIdx(['weight_kg', 'weight', 'weight_grams']);

  if (skuIdx < 0) return [];

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const rawWeight = cols[weightIdx];
    let weight: number | null = null;
    if (rawWeight !== undefined) {
      const w = parseNum(rawWeight);
      // If column is named weight_grams, convert to kg
      if (w !== null && headers[weightIdx]?.includes('gram')) {
        weight = w / 1000;
      } else {
        weight = w;
      }
    }
    return {
      sku:        (cols[skuIdx] ?? '').trim().toUpperCase(),
      cost_price: priceIdx >= 0 ? parseNum(cols[priceIdx]) : null,
      stock_qty:  stockIdx >= 0 ? (parseNum(cols[stockIdx]) !== null ? Math.round(parseNum(cols[stockIdx])!) : null) : null,
      weight_kg:  weight,
    };
  }).filter(r => r.sku);
}

const StockImportPage: React.FC = () => {
  const { products, updateProducts } = useCart();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [applied, setApplied] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a .csv file');
      return;
    }
    setFileName(file.name);
    setApplied(false);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCsv(text);

      if (rows.length === 0) {
        toast.error('Could not parse CSV. Ensure it has a "sku" column.');
        return;
      }

      const productMap = new Map(products.map(p => [p.sku.toUpperCase(), p]));
      const updates: ImportResult['updates'] = [];
      const unmatched: string[] = [];

      for (const row of rows) {
        const product = productMap.get(row.sku);
        if (!product) { unmatched.push(row.sku); continue; }
        updates.push({
          sku:       product.sku,
          name:      product.name,
          oldCost:   product.price,
          newCost:   row.cost_price,
          oldStock:  product.stock_qty,
          newStock:  row.stock_qty,
          oldWeight: product.weight_kg,
          newWeight: row.weight_kg,
        });
      }

      setResult({ matched: updates.length, unmatched, updates });
    };
    reader.readAsText(file);
  }, [products]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleApply = () => {
    if (!result) return;
    const updatedProducts: Product[] = products.map(p => {
      const update = result.updates.find(u => u.sku === p.sku);
      if (!update) return p;
      return {
        ...p,
        price:      update.newCost !== null ? update.newCost : p.price,
        stock_qty:  update.newStock !== null ? update.newStock : p.stock_qty,
        weight_kg:  update.newWeight !== null ? update.newWeight : p.weight_kg,
        availability: update.newStock !== null
          ? (update.newStock === 0 ? 'Out of Stock' : update.newStock <= 5 ? 'Low Stock' : 'In Stock')
          : p.availability,
      };
    });
    updateProducts(updatedProducts);
    setApplied(true);
    toast.success(`✅ ${result.matched} products updated from ${fileName}`);
  };

  const fmtPrice = (v: number | null | undefined) =>
    v == null ? '—' : `£${v.toFixed(2)}`;

  const sellPrice = (cost: number | null) =>
    cost == null ? '—' : `£${applyMargin(cost).toFixed(2)}`;

  return (
    <PageLayout>
      <PageMeta
        title="Stock Import — Staff Portal | C-Hear Technologies"
        description="Staff tool for importing daily supplier CSV stock feeds. Updates cost prices, stock quantities and weights with automatic margin calculation."
        keywords="stock import, CSV feed, staff portal, inventory management"
      />
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">STOCK MANAGEMENT</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Daily Stock Feed Import</h1>
          <p className="text-white/60 max-w-2xl text-sm">
            Upload your supplier CSV each morning. Cost prices are automatically marked up by {(MARGIN_RATE * 100).toFixed(0)}% to generate sell prices. Stock quantities and weights are updated instantly.
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 space-y-8">

          {/* Pricing rules summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Margin Applied', value: `${(MARGIN_RATE * 100).toFixed(0)}%`, sub: 'Net profit on cost price' },
              { label: 'UK VAT Rate',    value: '20%',  sub: 'Added at checkout for GB orders' },
              { label: 'EU / US / Other', value: '0%', sub: 'Zero-rated / customer clears customs' },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded p-4 text-center">
                <p className="text-3xl font-extrabold text-primary">{item.value}</p>
                <p className="font-bold text-sm mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* CSV format guide */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="font-extrabold text-sm uppercase tracking-widest mb-3">Expected CSV Format</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted">
                    {['sku *', 'cost_price', 'stock_qty', 'weight_kg'].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-bold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['CH-LT-001', '849.00', '12', '2.1'],
                    ['CH-NW-007', '145.50', '0',  '0.8'],
                    ['CH-SW-003', '299.00', '25', '0.1'],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 font-mono text-foreground">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              * Only <code className="bg-muted px-1 rounded">sku</code> is required. Any combination of <code className="bg-muted px-1 rounded">cost_price</code>, <code className="bg-muted px-1 rounded">stock_qty</code>, <code className="bg-muted px-1 rounded">weight_kg</code> will be updated.
              Column names are case-insensitive. Aliases: <code className="bg-muted px-1 rounded">price</code>, <code className="bg-muted px-1 rounded">cost</code>, <code className="bg-muted px-1 rounded">quantity</code>, <code className="bg-muted px-1 rounded">weight_grams</code>.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-brand-red-soft' : 'border-border hover:border-primary hover:bg-muted/50'
            }`}
          >
            <Upload size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-bold text-base mb-1">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <span className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded hover:bg-primary/90 transition-colors">
              Select CSV File
            </span>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Results preview */}
          {result && (
            <div className="bg-card border border-border rounded overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <span className="font-extrabold">{fileName}</span>
                </div>
                <div className="flex items-center gap-4 ml-auto text-sm flex-wrap">
                  <span className="flex items-center gap-1.5 text-green-700">
                    <CheckCircle2 size={14} /> {result.matched} matched
                  </span>
                  {result.unmatched.length > 0 && (
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <AlertTriangle size={14} /> {result.unmatched.length} unmatched
                    </span>
                  )}
                </div>
              </div>

              {/* Unmatched SKUs */}
              {result.unmatched.length > 0 && (
                <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>SKUs not found in catalogue: {result.unmatched.join(', ')}</span>
                </div>
              )}

              {/* Update table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-muted text-muted-foreground">
                      <th className="px-4 py-2.5 text-left font-bold">SKU</th>
                      <th className="px-4 py-2.5 text-left font-bold">Product</th>
                      <th className="px-4 py-2.5 text-right font-bold">Old Cost</th>
                      <th className="px-4 py-2.5 text-right font-bold">New Cost</th>
                      <th className="px-4 py-2.5 text-right font-bold">Sell Price (+{(MARGIN_RATE*100).toFixed(0)}%)</th>
                      <th className="px-4 py-2.5 text-right font-bold">Old Stock</th>
                      <th className="px-4 py-2.5 text-right font-bold">New Stock</th>
                      <th className="px-4 py-2.5 text-right font-bold">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.updates.map(u => (
                      <tr key={u.sku} className="hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">{u.sku}</td>
                        <td className="px-4 py-2.5 max-w-[200px] truncate font-medium">{u.name}</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{fmtPrice(u.oldCost)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {u.newCost !== null ? (
                            <span className={u.oldCost !== u.newCost ? 'text-primary' : ''}>{fmtPrice(u.newCost)}</span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold text-green-700">{sellPrice(u.newCost ?? u.oldCost)}</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{u.oldStock ?? '—'}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {u.newStock !== null ? (
                            <span className={u.newStock === 0 ? 'text-red-600' : u.newStock <= 5 ? 'text-amber-600' : 'text-green-700'}>
                              {u.newStock}
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">
                          {u.newWeight !== null ? u.newWeight : u.oldWeight ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Apply / reset */}
              <div className="px-5 py-4 border-t border-border flex items-center gap-3 flex-wrap">
                {applied ? (
                  <span className="flex items-center gap-2 text-green-700 font-bold text-sm">
                    <CheckCircle2 size={16} /> Applied — catalogue updated for this session
                  </span>
                ) : (
                  <button
                    onClick={handleApply}
                    className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded hover:bg-primary/90 transition-colors text-sm"
                  >
                    Apply {result.matched} Updates →
                  </button>
                )}
                <button
                  onClick={() => { setResult(null); setFileName(''); setApplied(false); if (fileRef.current) fileRef.current.value = ''; }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} /> Clear
                </button>
                {applied && (
                  <button
                    onClick={() => { setResult(null); setFileName(''); setApplied(false); if (fileRef.current) fileRef.current.value = ''; }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <RefreshCw size={14} /> Import another file
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default StockImportPage;
