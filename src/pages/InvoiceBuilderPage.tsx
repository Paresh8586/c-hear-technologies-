/**
 * InvoiceBuilderPage — /admin/invoice
 *
 * Staff tool to raise a formal invoice after a quote is accepted.
 *
 * Features:
 *  - Duplicate the accepted quote (staff manually fills in details)
 *  - Invoice number, due date, PO reference
 *  - Full line-item table (desc, SKU, qty, unit price ex-VAT)
 *  - Auto VAT + delivery totals
 *  - Optional secure payment link field for the selected merchant provider
 *  - "Send Invoice" → opens email client to client address, CC sales@
 *  - "Copy Invoice Link" → copies a shareable /invoice/:ref URL for
 *    the client-facing invoice page
 *  - Live HTML preview matching the client view
 */
import React, { useState, useMemo } from 'react';
import { PlusCircle, Trash2, Send, Copy, Link2, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { VAT_RATES } from '@/lib/pricing';

interface LineItem {
  id: string;
  description: string;
  sku: string;
  qty: number;
  unitPriceExVat: number;
}
type Country = 'GB' | 'EU' | 'US' | 'OTHER';

let counter = 0;
const newLine = (): LineItem => ({
  id: `inv-${++counter}`,
  description: '', sku: '', qty: 1, unitPriceExVat: 0,
});

function invUid(): string {
  const date = new Date();
  const yy   = date.getFullYear().toString().slice(2);
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `INV-${yy}${mm}-${rand}`;
}

const InvoiceBuilderPage: React.FC = () => {
  const [invoiceRef]  = useState(invUid);
  const todayStr      = new Date().toISOString().split('T')[0];
  const dueStr        = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [client, setClient] = useState({ name: '', company: '', email: '', phone: '', address: '' });
  const [meta, setMeta]     = useState({
    date: todayStr, due: dueStr, poRef: '',
    country: 'GB' as Country, notes: '',
    paymentUrl: '',  // Hosted payment page URL from the selected provider
  });
  const [lines, setLines]   = useState<LineItem[]>([newLine()]);
  const [delivery, setDelivery] = useState(0);
  const [copied, setCopied]     = useState(false);

  // ── Calculations ──────────────────────────────────────────────────────────
  const vatRate       = VAT_RATES[meta.country] ?? 0;
  const subtotalExVat = useMemo(() => lines.reduce((s, l) => s + l.qty * l.unitPriceExVat, 0), [lines]);
  const vatAmount     = useMemo(() => (subtotalExVat + delivery) * vatRate, [subtotalExVat, delivery, vatRate]);
  const grandTotal    = subtotalExVat + delivery + vatAmount;
  const fmt           = (n: number) => `£${n.toFixed(2)}`;

  // ── Line helpers ──────────────────────────────────────────────────────────
  const updateLine = (id: string, field: keyof LineItem, value: string | number) =>
    setLines(ls => ls.map(l => l.id === id ? { ...l, [field]: value } : l));
  const removeLine = (id: string) => setLines(ls => ls.filter(l => l.id !== id));
  const addLine    = ()            => setLines(ls => [...ls, newLine()]);

  // ── Invoice URL (client-facing view page) ─────────────────────────────────
  const invoiceViewUrl = useMemo(() => {
    // Encode all invoice data into base64 URL param so client page is self-contained
    const payload = {
      ref: invoiceRef,
      date: meta.date,
      due: meta.due,
      poRef: meta.poRef,
      country: meta.country,
      notes: meta.notes,
      paymentUrl: meta.paymentUrl,
      client,
      lines,
      delivery,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    return `${window.location.origin}/invoice?data=${encoded}`;
  }, [invoiceRef, meta, client, lines, delivery]);

  // ── Email body (plain text) ───────────────────────────────────────────────
  const emailBody = useMemo(() => {
    const lineRows = lines.map(l =>
      `  ${l.description || '(item)'}${l.sku ? ` [${l.sku}]` : ''}  Qty: ${l.qty}  @ ${fmt(l.unitPriceExVat)} ea  = ${fmt(l.qty * l.unitPriceExVat)}`
    ).join('\n');
    return [
      `INVOICE`,
      `────────────────────────────────────────────`,
      `Invoice No : ${invoiceRef}`,
      `Date       : ${meta.date}`,
      `Due Date   : ${meta.due}`,
      meta.poRef ? `PO Ref     : ${meta.poRef}` : '',
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
      `  AMOUNT DUE               : ${fmt(grandTotal)}`,
      `  Due by                   : ${meta.due}`,
      ``,
      meta.notes ? `NOTES:\n  ${meta.notes}\n` : '',
      meta.paymentUrl
        ? `SECURE PAYMENT LINK:\n  ${meta.paymentUrl}\n`
        : `VIEW / PAY YOUR INVOICE:\n  ${invoiceViewUrl}\n`,
      `────────────────────────────────────────────`,
      `Bank transfer details are also accepted.`,
      `Please quote invoice number ${invoiceRef} on your payment.`,
      ``,
      `C Hear Technologies Limited`,
      `sales@c-hear.online | www.c-hear.online | 0203 807 8262`,
    ].filter(Boolean).join('\n');
  }, [invoiceRef, meta, client, lines, subtotalExVat, delivery, vatRate, vatAmount, grandTotal, invoiceViewUrl]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!client.email) { toast.error('Enter the customer email address.'); return; }
    const subject = encodeURIComponent(`Invoice ${invoiceRef} — C Hear Technologies`);
    window.location.href = `mailto:${client.email}?cc=sales%40c-hear.online&subject=${subject}&body=${encodeURIComponent(emailBody)}`;
    toast.success('Email client opened — send from sales@c-hear.online');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invoiceViewUrl).then(() => {
      setCopied(true);
      toast.success('Invoice link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <PageMeta
        title="Invoice Builder — Staff Portal | C-Hear Technologies"
        description="Staff tool for raising formal invoices after quote acceptance, with an optional hosted payment link and client-facing invoice view."
        keywords="invoice builder, staff portal, IT invoice, payment link"
      />
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">STAFF TOOLS</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Invoice Builder</h1>
          <p className="text-white/60 max-w-2xl text-sm">
            Raise a formal invoice after quote acceptance. Add a secure payment link from your merchant provider and send from <strong>sales@c-hear.online</strong>.
          </p>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 flex flex-col gap-6">

          {/* Invoice meta */}
          <div className="bg-card border border-border rounded p-5 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Invoice Number</p>
                <p className="font-extrabold text-lg font-mono">{invoiceRef}</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap ml-auto">
              {[
                { label: 'Invoice Date', field: 'date' as const, type: 'date' },
                { label: 'Due Date',     field: 'due'  as const, type: 'date' },
              ].map(({ label, field, type }) => (
                <label key={field} className="flex flex-col gap-1 text-xs">
                  <span className="font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
                  <input type={type} value={meta[field] as string}
                    onChange={e => setMeta(m => ({ ...m, [field]: e.target.value }))}
                    className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background" />
                </label>
              ))}
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-bold uppercase tracking-wide text-muted-foreground">PO Reference</span>
                <input value={meta.poRef} onChange={e => setMeta(m => ({ ...m, poRef: e.target.value }))}
                  placeholder="optional"
                  className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background" />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-bold uppercase tracking-wide text-muted-foreground">Country / VAT</span>
                <select value={meta.country} onChange={e => setMeta(m => ({ ...m, country: e.target.value as Country }))}
                  className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary bg-background">
                  <option value="GB">UK (20%)</option>
                  <option value="EU">EU (0%)</option>
                  <option value="US">US (0%)</option>
                  <option value="OTHER">Other (0%)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: client + lines + payment link */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Client */}
              <div className="bg-card border border-border rounded p-5">
                <h3 className="font-extrabold text-sm uppercase tracking-widest mb-3">Bill To</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Full name *" value={client.name} onChange={e => setClient(c => ({ ...c, name: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Company name" value={client.company} onChange={e => setClient(c => ({ ...c, company: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input type="email" placeholder="Customer email *" value={client.email} onChange={e => setClient(c => ({ ...c, email: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Phone" value={client.phone} onChange={e => setClient(c => ({ ...c, phone: e.target.value }))}
                    className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input placeholder="Billing / delivery address" value={client.address} onChange={e => setClient(c => ({ ...c, address: e.target.value }))}
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
                              placeholder="Product / service description"
                              className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-background" />
                          </td>
                          <td className="px-2 py-2">
                            <input value={line.sku} onChange={e => updateLine(line.id, 'sku', e.target.value)}
                              placeholder="SKU"
                              className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-background font-mono" />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" min={1} value={line.qty}
                              onChange={e => updateLine(line.id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
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

              {/* Payment link + notes */}
              <div className="bg-card border border-border rounded p-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                      <Link2 size={13} /> Secure Payment Link
                    </label>
                  </div>
                  <input
                    type="url"
                    value={meta.paymentUrl}
                    onChange={e => setMeta(m => ({ ...m, paymentUrl: e.target.value }))}
                    placeholder="Paste the hosted payment URL from your merchant provider"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary font-mono"
                  />
                  {meta.paymentUrl && (
                    <p className="text-[11px] text-green-700 mt-1 font-semibold flex items-center gap-1">
                      ✓ Payment link set — the "Pay Now" button on the client invoice will point here.
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Leave blank to include the auto-generated invoice view URL instead.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Notes / Payment Terms</label>
                  <textarea rows={3} value={meta.notes} onChange={e => setMeta(m => ({ ...m, notes: e.target.value }))}
                    placeholder="e.g. Payment due within 14 days. Bank details: …"
                    className="w-full border border-border rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            {/* Right: totals + actions */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-card border border-border rounded p-5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Delivery Charge (ex-VAT, £)</label>
                <input type="number" min={0} step={0.01} value={delivery}
                  onChange={e => setDelivery(parseFloat(e.target.value) || 0)}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="bg-card border border-border rounded p-5 flex flex-col gap-2 text-sm">
                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground mb-1">Invoice Totals</p>
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
                  <span>Amount Due</span><span className="text-primary">{fmt(grandTotal)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Due: {meta.due}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={handleSend}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-primary/90 transition-colors">
                  <Send size={15} /> Send Invoice via Email
                </button>
                <button onClick={handleCopyLink}
                  className={`w-full flex items-center justify-center gap-2 border font-semibold py-2.5 rounded transition-colors text-sm ${
                    copied
                      ? 'border-green-500 text-green-700 bg-green-50'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}>
                  {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Invoice Link</>}
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground">
                The invoice link takes the client to a branded payment page with a "Pay Now" button linked to the payment URL you provide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default InvoiceBuilderPage;
