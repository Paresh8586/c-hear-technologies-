import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';
import WorldpayPayment from '@/components/payment/WorldpayPayment';
import type { Currency } from '@/types/product';
import { CURRENCY_RATES, CURRENCY_SYMBOLS } from '@/types/product';
import {
  applyMargin, calcVat, getDeliveryTier, DEFAULT_WEIGHT_KG, VAT_RATES,
} from '@/lib/pricing';

type Country = 'GB' | 'US' | 'EU' | 'OTHER' | '';
type Step = 'details' | 'payment' | 'confirmed';

const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('mode') === 'buy';
  const { buyCart, quoteCart, products, clearCart, buyItems, quoteItems } = useCart();

  // Checkout always operates on the Buy Now cart; quote flow uses QuotePage
  const cart     = isBuyNow ? buyCart : quoteCart;
  const totalItems = isBuyNow ? buyItems : quoteItems;
  const [country, setCountry]   = useState<Country>('');
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [step, setStep]         = useState<Step>('details');
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    city: '', postcode: '', address: '', message: '',
  });

  const getProduct = (sku: string) => products.find(p => p.sku === sku);

  const vatRate = country ? (VAT_RATES[country] ?? 0) : 0;
  const rate    = CURRENCY_RATES[currency];
  const sym     = CURRENCY_SYMBOLS[currency];

  const fmt = (gbp: number) =>
    `${sym} ${(gbp * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const breakdown = useMemo(() => {
    const items = cart.map(item => {
      const p = getProduct(item.sku);
      const costEach  = p?.price ?? 0;
      const sellEach  = applyMargin(costEach);
      const totalSell = sellEach * item.qty;
      const totalVat  = calcVat(totalSell, country || 'OTHER');
      const weight    = (p?.weight_kg ?? DEFAULT_WEIGHT_KG) * item.qty;
      return { sku: item.sku, name: p?.name ?? item.sku, qty: item.qty, sellEach, totalSell, totalVat, weight };
    });

    const subtotalExVat = items.reduce((s, i) => s + i.totalSell, 0);
    const totalVat      = items.reduce((s, i) => s + i.totalVat, 0);
    const totalWeightKg = items.reduce((s, i) => s + i.weight, 0);
    const deliveryTier  = getDeliveryTier(totalWeightKg);
    const deliveryExVat = deliveryTier.price;
    const deliveryVat   = calcVat(deliveryExVat, country || 'OTHER');
    const grandTotal    = subtotalExVat + totalVat + deliveryExVat + deliveryVat;

    return { items, subtotalExVat, totalVat, totalWeightKg, deliveryTier, deliveryExVat, deliveryVat, grandTotal };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, country]);

  // Step 1 → Step 2
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country) { toast.error('Please select a delivery country to calculate VAT.'); return; }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Worldpay returned a session token → payment authorised
  const handlePaymentSuccess = (sessionId: string, amountPence: number) => {
    // In production: POST { sessionId, amountPence, orderRef, ...form } to your server
    // which calls the Worldpay Orders API with the SERVICE_KEY (server-side only).
    console.info('Worldpay session token:', sessionId, 'amount pence:', amountPence);
    toast.success('Payment authorised! Order confirmed.');
    clearCart('buy');
    setStep('confirmed');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = [
    { id: 'details', label: 'Your Details' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmed', label: 'Confirmed' },
  ] as const;

  const stepIndex = steps.findIndex(s => s.id === step);

  // ── Shared order summary column ───────────────────────────────────────────
  const OrderSummary = (
    <div className="lg:col-span-1 flex flex-col gap-4">
      {/* Country + currency */}
      {step === 'details' && (
        <div className="bg-card border-2 border-foreground rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Pricing & Delivery Options</p>
          </div>
          <div>
            <label className="text-sm font-extrabold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 text-foreground">
              <span className="inline-block w-1.5 h-4 bg-primary rounded-full shrink-0" />
              Delivery Country
            </label>
            <select value={country} onChange={e => setCountry(e.target.value as Country)}
              className="w-full border-2 border-primary rounded px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background">
              <option value="">— Select your delivery country —</option>
              <option value="GB">🇬🇧  United Kingdom (VAT 20%)</option>
              <option value="EU">🇪🇺  European Union (0% VAT)</option>
              <option value="US">🇺🇸  United States (0% VAT)</option>
              <option value="OTHER">🌍  Other (0% VAT)</option>
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">Required — determines VAT applied to your order</p>
          </div>
          <div>
            <label className="text-sm font-extrabold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 text-foreground">
              <span className="inline-block w-1.5 h-4 bg-primary rounded-full shrink-0" />
              Display Currency
            </label>
            <select value={currency} onChange={e => setCurrency(e.target.value as Currency)}
              className="w-full border-2 border-primary rounded px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background">
              <option value="GBP">GBP — British Pound £</option>
              <option value="USD">USD — US Dollar $</option>
              <option value="EUR">EUR — Euro €</option>
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">All prices are billed in GBP — display currency for reference only</p>
          </div>
        </div>
      )}

      {/* Line items + breakdown */}
      <div className="bg-card border border-border rounded">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <ShoppingBag size={16} className="text-primary" />
          <span className="font-bold text-sm">Order Summary</span>
          {totalItems > 0 && (
            <span className="ml-auto text-xs bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
          )}
        </div>
        {cart.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingBag size={32} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Your enquiry list is empty.</p>
            <Link to="/products" className="text-primary text-sm font-bold hover:underline">Browse products →</Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {breakdown.items.map(item => (
                <div key={item.sku} className="px-4 py-3 flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">SKU: {item.sku} · ×{item.qty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold">{fmt(item.totalSell)}</p>
                    <p className="text-[10px] text-muted-foreground">ex-VAT</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border bg-muted/30 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (ex-VAT)</span>
                <span className="font-semibold">{fmt(breakdown.subtotalExVat)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  VAT
                  {country && (
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 rounded">
                      {(vatRate * 100).toFixed(0)}%
                    </span>
                  )}
                </span>
                <span className="font-semibold">{fmt(breakdown.totalVat)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground flex flex-col">
                  <span>Delivery</span>
                  <span className="text-[10px]">{breakdown.deliveryTier.label}</span>
                  <span className="text-[10px]">{breakdown.totalWeightKg.toFixed(2)} kg total</span>
                </span>
                <div className="text-right">
                  <p className="font-semibold">{fmt(breakdown.deliveryExVat)}</p>
                  {vatRate > 0 && (
                    <p className="text-[10px] text-muted-foreground">+{fmt(breakdown.deliveryVat)} VAT</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-border">
                <span>Total (inc. VAT + delivery)</span>
                <span className="text-primary">{fmt(breakdown.grandTotal)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded flex gap-2">
        <Info size={14} className="shrink-0 mt-0.5" />
        <p>VAT and delivery are estimated — final figures confirmed before fulfilment.</p>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <PageMeta
        title="Checkout — C-Hear Technologies"
        description="Complete your IT hardware or software order with C-Hear Technologies. Secure checkout with VAT and delivery calculated by country."
        keywords="IT checkout, buy IT hardware, secure order, technology purchase"
      />
      {/* Hero */}
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">CHECKOUT</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Complete your order</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-0 max-w-sm">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  i <= stepIndex ? 'text-white' : 'text-white/40'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold border-2 ${
                    i < stepIndex  ? 'bg-green-500 border-green-500 text-white' :
                    i === stepIndex ? 'bg-primary border-primary text-white' :
                    'bg-transparent border-white/30 text-white/40'
                  }`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${i < stepIndex ? 'bg-green-500' : 'bg-white/20'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">

          {/* ── Step 1: Details ── */}
          {step === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {OrderSummary}
              <form onSubmit={handleDetailsSubmit} className="lg:col-span-2 bg-card border border-border rounded p-6 flex flex-col gap-3">
                <h2 className="font-extrabold text-xl mb-1">Delivery & Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name *" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Company name" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Business email *" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Telephone" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City / County / State" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                  <input value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))}
                    placeholder="Postcode / ZIP" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <textarea rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full delivery address"
                  className="border border-border rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary" />
                {!isBuyNow && (
                  <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Special requirements, quantities or configurations *"
                    className="border border-border rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary" />
                )}

                {cart.length > 0 && (
                  <div className="bg-muted/40 border border-border rounded p-4 text-xs flex flex-col gap-1">
                    <p className="font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Price Summary</p>
                    <div className="flex justify-between"><span className="text-muted-foreground">Products ex-VAT</span><span className="font-semibold">{fmt(breakdown.subtotalExVat)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">VAT ({(vatRate*100).toFixed(0)}%)</span><span className="font-semibold">{fmt(breakdown.totalVat)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Delivery ({breakdown.deliveryTier.label})</span><span className="font-semibold">{fmt(breakdown.deliveryExVat + breakdown.deliveryVat)}</span></div>
                    <div className="flex justify-between font-extrabold text-sm border-t border-border pt-2 mt-1">
                      <span>Estimated Total</span><span className="text-primary">{fmt(breakdown.grandTotal)}</span>
                    </div>
                  </div>
                )}

                <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {OrderSummary}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Details recap */}
                <div className="bg-card border border-border rounded p-4 text-sm flex flex-col gap-1">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Delivering to</p>
                  <p className="font-semibold">{form.name}{form.company ? ` · ${form.company}` : ''}</p>
                  <p className="text-muted-foreground text-xs">{[form.address, form.city, form.postcode].filter(Boolean).join(', ')}</p>
                  <p className="text-muted-foreground text-xs">{form.email}{form.phone ? ` · ${form.phone}` : ''}</p>
                  <button onClick={() => setStep('details')} className="text-xs text-primary hover:underline mt-1 text-left">← Edit details</button>
                </div>

                <WorldpayPayment
                  amountGBP={breakdown.grandTotal}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep('details')}
                />
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmed ── */}
          {step === 'confirmed' && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-green-50 border border-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-2">Thank you, {form.name}. Your payment has been authorised by Worldpay.</p>
              <p className="text-muted-foreground text-sm mb-8">A confirmation will be sent to <span className="font-semibold text-foreground">{form.email}</span>. Our team will process your order and arrange delivery.</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors">
                Continue Shopping
              </Link>
            </div>
          )}

        </div>
      </section>
    </PageLayout>
  );
};

export default CheckoutPage;
