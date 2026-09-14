/**
 * QuoteBuilderPage — /admin/quote
 *
 * Staff tool to compose a formal quote reply to a customer enquiry received
 * at info@c-hear.online.  The staff fills in:
 *   - Customer contact info (copied from the enquiry email)
 *   - Quote reference & expiry
 *   - Line items (product, qty, unit price ex-VAT)
 *   - Delivery charge, VAT (auto-calculated), notes
 *
 * On submit → opens the staff's email client pre-filled to send the quote
 * from sales@c-hear.online with a formatted plain-text quote body.
 *
 * A "Preview Quote" panel shows the formatted output in real time.
 */
import React, { useState, useMemo } from 'react';
import { PlusCircle, Trash2, Send, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { VAT_RATES } from '@/lib/pricing';

// ── Types ─────────────────────────────────────────────────────────────────
interface LineItem {
  id: string;
  description: string;
  sku: string;
  qty: number;
  unitPriceExVat: number;
}

type Country = 'GB' | 'EU' | 'US' | 'OTHER';

let lineCounter = 0;
const newLine = (): LineItem => ({
  id: `line-${++lineCounter}`,
  description: '',
  sku: '',
  qty: 1,
  unitPriceExVat: 0,
});

function uid(): string {
  return `QT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

// ── Component ─────────────────────────────────────────────────────────────
const QuoteBuilderPage: React.FC = () => {
  const [quoteRef]      = useState(uid);
  const today           = new Date().toISOString().split('T')[0];
  const thirtyDays      = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const [client, setClient] = useState({ name: '', company: '', email: '', phone: '', address: '' });
  const [meta, setMeta]     = useState({ date: today, expiry: thirtyDays, country: 'GB' as Country, notes: '' });
  const [lines, setLines]   = useState<LineItem[]>([newLine()]);
  const [delivery, setDelivery] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // ── Calculations ─────────────────────────────────────────────────────────
  const vatRate       = VAT_RATES[meta.country] ?? 0;
  const subtotalExVat = useMemo(() => lines.reduce((s, l) => s + l.qty * l.unitPriceExVat, 0), [lines]);
  const vatAmount     = useMemo(() => (subtotalExVat + delivery) * vatRate, [subtotalExVat, delivery, vatRate]);
  const grandTotal    = subtotalExVat + delivery + vatAmount;

  const fmt = (n: number) => `£${n.toFixed(2)}`;

  // ── Line helpers ─────────────────────────────────────────────────────────
  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    setLines(ls => ls.map(l => l.id === id ? { ...l, [field]: value } : l));
  };
  const removeLine = (id: string) => setLines(ls => ls.filter(l => l.id !== id));
  const addLine    = ()            => setLines(ls => [...ls, newLine()]);

  // ── Quote text (plain-text for email body) ───────────────────────────────
  const quoteText = useMemo(() => {
    const lineRows = lines.map(l =>
      `  ${l.description || '(item)'}${l.sku ? ` [${l.sku}]` : ''}  Qty: ${l.qty}  @ ${fmt(l.unitPriceExVat)} ea  = ${fmt(l.qty * l.unitPriceExVat)}`
    ).join('\n');
    return [
      `QUOTATION`,
      `────────────────────────────────────────────`,
      `Reference : ${quoteRef}`,
      `Date      : ${meta.date}`,
      `Valid until: ${meta.expiry}`,
      ``,
      `TO:`,
      `  ${client.name}${client.company ? ` | ${client.company}` : ''}`,
      client.email ? `  ${client.email}` : '',
      client.phone ? `  ${client.phone}` : '',
      client.address ? `  ${client.address}` : '',
      ``,
      `ITEMS:`,
      lineRows,
      ``,
      `  Subtotal (ex-VAT)        : ${fmt(subtotalExVat)}`,
      `  Delivery (ex-VAT)        : ${fmt(delivery)}`,
      `  VAT (${(vatRate * 100).toFixed(0)}%)             : ${fmt(vatAmount)}`,
      `  ─────────────────────────────────────`,
      `  TOTAL                    : ${fmt(grandTotal)}`,
      ``,
      meta.notes ? `NOTES:\n  ${meta.notes}\n` : '',
      `────────────────────────────────────────────`,
      `This quotation is valid for 30 days from the date above.`,
      `To place your order or discuss further, please reply to this email`,
      `or call us on 0203 807 8262.`,
      ``,
      `C Hear Technologies Limited`,
      `sales@c-hear.online  |  www.c-hear.online  |  0203 807 8262`,
    ].filter(l => l !== null).join('\n');
  }, [quoteRef, meta, client, lines, subtotalExVat, delivery, vatRate, vatAmount, grandTotal]);

  // ── Send email ────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!client.email) { toast.error('Please enter the customer email address.'); return; }
    if (lines.every(l => !l.description)) { toast.error('Please add at least one line item.'); return; }
    const subject = encodeURIComponent(`Quotation ${quoteRef} — C Hear Technologies`);
    window.location.href = `mailto:${client.email}?cc=sales%40c-hear.online&subject=${subject}&body=${encodeURIComponent(quoteText)}`;
    toast.success('Email client opened — review and send from sales@c-hear.online');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <PageMeta
        title="Quote Builder — Staff Portal | C-Hear Technologies"
        description="Staff tool for composing formal quotations in response to customer enquiries. Auto-calculates VAT and prepares a ready-to-send quote email."
        keywords="quote builder, staff portal, IT quotation, business quote"
      />
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">STAFF TOOLS</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Quote Builder</h1>
          <p className="text-white/60 max-w-2xl text-sm">
            Compose a formal quotation in response to a customer enquiry. The completed quote opens in your email client, ready to send from <strong>sales@c-hear.online</strong>.
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 flex flex-col gap-6">

          {/* Ref + meta row */}
          <div className="bg-card border border-border rounded p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Quote Reference</p>
                <p className="font-extrabold text-lg font-mono">{quoteRef}</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap ml-auto">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-bold uppercase tracking-wide text-muted-foreground">Date</span>
                <input type="date" value={meta.date}
                  onChange={e => setMeta(m => ({ ...m, date: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background" />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-bold uppercase tracking-wide text-muted-foreground">Valid Until</span>
                <input type="date" value={meta.expiry}
                  onChange={e => setMeta(m => ({ ...m, expiry: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background" />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-bold uppercase tracking-wide text-muted-foreground">Delivery Country</span>
                <select value={meta.country} onChange={e => setMeta(m => ({ ...m, country: e.target.value as Country }))}
                  className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background">
                  <option value="GB">UK (VAT 20%)</option>
                  <option value="EU">EU (0%)</option>
                  <option value="US">US (0%)</option>
                  <option value="OTHER">Other (0%)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: client + lines */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Customer details */}
              <div className="bg-card border border-border rounded p-5">
                <h3 className="font-extrabold text-sm uppercase tracking-widest mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Full name *" value={client.name} onChange={e => setClient(c => ({ ...c, name: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Company name" value={client.company} onChange={e => setClient(c => ({ ...c, company: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input type="email" required placeholder="Customer email *" value={client.email} onChange={e => setClient(c => ({ ...c, email: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Phone" value={client.phone} onChange={e => setClient(c => ({ ...c, phone: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Delivery address" value={client.address} onChange={e => setClient(c => ({ ...c, address: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary md:col-span-2" />
                </div>
              </div>

              {/* Line items */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-extrabold text-sm uppercase tracking-widest">Line Items</h3>
                  <button onClick={addLine} className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                    <PlusCircle size={14} /> Add Line
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-muted text-muted-foreground">
                        <th className="px-3 py-2.5 text-left font-bold w-[36%]">Description</th>
                        <th className="px-3 py-2.5 text-left font-bold w-[16%]">SKU</th>
                        <th className="px-3 py-2.5 text-right font-bold w-[10%]">Qty</th>
                        <th className="px-3 py-2.5 text-right font-bold w-[16%]">Unit (ex-VAT)</th>
                        <th className="px-3 py-2.5 text-right font-bold w-[16%]">Line Total</th>
                        <th className="px-1 py-2.5 w-[6%]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {lines.map(line => (
                        <tr key={line.id}>
                          <td className="px-2 py-2">
                            <input value={line.description} onChange={e => updateLine(line.id, 'description', e.target.value)}
                              placeholder="Product description"
                              className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-background" />
                          </td>
                          <td className="px-2 py-2">
                            <input value={line.sku} onChange={e => updateLine(line.id, 'sku', e.target.value)}
                              placeholder="SKU"
                              className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-background font-mono" />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min={1} value={line.qty} onChange={e => updateLine(line.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full border border-border rounded px-2 py-1.5 text-xs text-right focus:outline-none focus:border-primary bg-background" />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min={0} step={0.01} value={line.unitPriceExVat}
                              onChange={e => updateLine(line.id, 'unitPriceExVat', parseFloat(e.target.value) || 0)}
                              className="w-full border border-border rounded px-2 py-1.5 text-xs text-right focus:outline-none focus:border-primary bg-background" />
                          </td>
                          <td className="px-3 py-2 text-right font-bold">{fmt(line.qty * line.unitPriceExVat)}</td>
                          <td className="px-2 py-2 text-center">
                            <button onClick={() => removeLine(line.id)} disabled={lines.length === 1}
                              className="text-muted-foreground hover:text-red-600 disabled:opacity-30 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded p-5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Additional Notes / Terms</label>
                <textarea rows={3} value={meta.notes} onChange={e => setMeta(m => ({ ...m, notes: e.target.value }))}
                  placeholder="e.g. lead time, warranty notes, installation included…"
                  className="w-full border border-border rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary" />
              </div>
            </div>

            {/* Right: totals + actions */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Delivery */}
              <div className="bg-card border border-border rounded p-5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Delivery Charge (ex-VAT, £)</label>
                <input type="number" min={0} step={0.01} value={delivery}
                  onChange={e => setDelivery(parseFloat(e.target.value) || 0)}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>

              {/* Totals */}
              <div className="bg-card border border-border rounded p-5 flex flex-col gap-2 text-sm">
                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground mb-1">Quote Totals</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal (ex-VAT)</span><span className="font-semibold">{fmt(subtotalExVat)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery (ex-VAT)</span><span className="font-semibold">{fmt(delivery)}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    VAT
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 rounded">{(vatRate * 100).toFixed(0)}%</span>
                  </span>
                  <span className="font-semibold">{fmt(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base pt-2 border-t border-border">
                  <span>Grand Total</span><span className="text-primary">{fmt(grandTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button onClick={handleSend}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-primary/90 transition-colors">
                  <Send size={15} /> Send Quote via Email
                </button>
                <button onClick={() => setShowPreview(p => !p)}
                  className="w-full flex items-center justify-center gap-2 border border-border text-muted-foreground font-semibold py-2.5 rounded hover:border-foreground hover:text-foreground transition-colors text-sm">
                  <Eye size={14} /> {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Clicking "Send Quote" opens your email client with the quote pre-filled. Send from <strong>sales@c-hear.online</strong>.
              </p>
            </div>
          </div>

          {/* Quote preview */}
          {showPreview && (
            <div className="bg-card border border-border rounded p-5">
              <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground mb-3">Quote Preview (email body)</p>
              <pre className="font-mono text-xs text-foreground whitespace-pre-wrap bg-muted/40 rounded p-4 overflow-x-auto">{quoteText}</pre>
            </div>
          )}

        </div>
      </section>
    </PageLayout>
  );
};

export default QuoteBuilderPage;
