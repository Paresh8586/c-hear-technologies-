import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart, FileText, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { CartMode } from '@/contexts/CartContext';
import { CATEGORY_ICONS, CURRENCY_RATES, CURRENCY_SYMBOLS } from '@/types/product';
import type { Currency } from '@/types/product';
import { applyMargin, calcVat, getDeliveryTier, DEFAULT_WEIGHT_KG, VAT_RATES } from '@/lib/pricing';

type Country = 'GB' | 'US' | 'EU' | 'OTHER';

const COUNTRIES: { code: Country; label: string; flag: string }[] = [
  { code: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', label: 'United States',  flag: '🇺🇸' },
  { code: 'EU', label: 'European Union', flag: '🇪🇺' },
  { code: 'OTHER', label: 'Rest of World', flag: '🌍' },
];

/* ── Quote item row (simple) ──────────────────────────────────────────────── */
const QuoteItemRow: React.FC<{ sku: string; qty: number }> = ({ sku, qty }) => {
  const { products, changeQty, removeFromCart } = useCart();
  const product = products.find(p => p.sku === sku);

  if (!product) return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded border border-border animate-pulse">
      <div className="w-12 h-12 bg-muted rounded shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded border border-border">
      <div className="w-12 h-12 bg-white border border-border rounded flex items-center justify-center text-xl shrink-0">
        {CATEGORY_ICONS[product.category] ?? '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm font-semibold truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <button onClick={() => changeQty(sku, 'quote', -1)}
            className="w-6 h-6 border border-border rounded hover:border-primary flex items-center justify-center" aria-label="Decrease">
            <Minus size={11} />
          </button>
          <span className="text-sm font-semibold w-5 text-center">{qty}</span>
          <button onClick={() => changeQty(sku, 'quote', 1)}
            className="w-6 h-6 border border-border rounded hover:border-primary flex items-center justify-center" aria-label="Increase">
            <Plus size={11} />
          </button>
        </div>
      </div>
      <button onClick={() => removeFromCart(sku, 'quote')}
        className="p-1.5 hover:text-destructive transition-colors self-start" aria-label="Remove">
        <Trash2 size={15} />
      </button>
    </div>
  );
};

/* ── Buy Now item row (with live price) ───────────────────────────────────── */
const BuyItemRow: React.FC<{
  sku: string; qty: number; country: Country; currency: Currency;
}> = ({ sku, qty, country, currency }) => {
  const { products, changeQty, removeFromCart } = useCart();
  const product = products.find(p => p.sku === sku);
  const sym = CURRENCY_SYMBOLS[currency];
  const rate = CURRENCY_RATES[currency];

  if (!product) return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded border border-border animate-pulse">
      <div className="w-12 h-12 bg-muted rounded shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
    </div>
  );

  const sellEach  = product.price != null ? applyMargin(product.price) : 0;
  const lineEx    = sellEach * qty;
  const fmt = (gbp: number) =>
    `${sym}${(gbp * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex gap-3 p-3 bg-white border border-border rounded">
      <div className="w-12 h-12 bg-muted border border-border rounded flex items-center justify-center text-xl shrink-0">
        {CATEGORY_ICONS[product.category] ?? '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm font-semibold truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <button onClick={() => changeQty(sku, 'buy', -1)}
              className="w-6 h-6 border border-border rounded hover:border-green-600 flex items-center justify-center" aria-label="Decrease">
              <Minus size={11} />
            </button>
            <span className="text-sm font-semibold w-5 text-center">{qty}</span>
            <button onClick={() => changeQty(sku, 'buy', 1)}
              className="w-6 h-6 border border-border rounded hover:border-green-600 flex items-center justify-center" aria-label="Increase">
              <Plus size={11} />
            </button>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">{fmt(sellEach)} × {qty}</p>
            <p className="text-sm font-bold text-green-700">{fmt(lineEx)}</p>
          </div>
        </div>
      </div>
      <button onClick={() => removeFromCart(sku, 'buy')}
        className="p-1.5 hover:text-destructive transition-colors self-start" aria-label="Remove">
        <Trash2 size={15} />
      </button>
    </div>
  );
};

/* ── Empty state ──────────────────────────────────────────────────────────── */
const EmptyState: React.FC<{ mode: CartMode; onClose: () => void }> = ({ mode, onClose }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
    {mode === 'quote'
      ? <FileText size={48} className="opacity-20" />
      : <ShoppingBag size={48} className="opacity-20" />}
    <p className="text-sm text-center">
      {mode === 'quote'
        ? <>Your quote enquiry list is empty.<br />Add products to request a quotation.</>
        : <>Your buy now cart is empty.<br />Add products to purchase directly.</>}
    </p>
    <Link to="/products" onClick={onClose} className="text-primary font-semibold text-sm underline">
      Browse Products
    </Link>
  </div>
);

/* ── Main drawer ──────────────────────────────────────────────────────────── */
const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    quoteCart, buyCart,
    quoteItems, buyItems,
    isOpen, activeTab, closeCart,
  } = useCart();

  const [country,  setCountry]  = useState<Country>('GB');
  const [currency, setCurrency] = useState<Currency>('GBP');

  const isBuy     = activeTab === 'buy';
  const itemCount = isBuy ? buyItems : quoteItems;

  /* ── live price breakdown for Buy Now ──────────────────────────────── */
  const breakdown = useMemo(() => {
    if (!isBuy || buyCart.length === 0) return null;
    const { products } = { products: [] as ReturnType<typeof Array.prototype.map> };
    return null; // placeholder — computed inside render using products from context
  }, [isBuy, buyCart]);

  /* We compute the breakdown inline using products from context */
  const BuyBreakdown: React.FC<{ sym: string; rate: number }> = ({ sym, rate }) => {
    const { products } = useCart();
    const fmt = (gbp: number) =>
      `${sym}${(gbp * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const rows = buyCart.map(item => {
      const p = products.find(x => x.sku === item.sku);
      const sellEach  = p?.price != null ? applyMargin(p.price) : 0;
      const lineEx    = sellEach * item.qty;
      const lineVat   = calcVat(lineEx, country);
      const weightKg  = (p?.weight_kg ?? DEFAULT_WEIGHT_KG) * item.qty;
      return { lineEx, lineVat, weightKg };
    });

    const subtotalEx  = rows.reduce((s, r) => s + r.lineEx, 0);
    const totalVat    = rows.reduce((s, r) => s + r.lineVat, 0);
    const totalWt     = rows.reduce((s, r) => s + r.weightKg, 0);
    const tier        = getDeliveryTier(totalWt);
    const deliveryEx  = tier.price;
    const deliveryVat = calcVat(deliveryEx, country);
    const grandTotal  = subtotalEx + totalVat + deliveryEx + deliveryVat;
    const vatRate     = VAT_RATES[country] ?? 0;

    return (
      <div className="flex flex-col gap-1.5 text-sm border-t border-border pt-3 mt-1">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal (ex-VAT)</span>
          <span className="font-semibold text-foreground">{fmt(subtotalEx)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>VAT ({(vatRate * 100).toFixed(0)}%)</span>
          <span className="font-semibold text-foreground">{fmt(totalVat)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery — {tier.label}</span>
          <span className="font-semibold text-foreground">{fmt(deliveryEx + deliveryVat)}</span>
        </div>
        <div className="flex justify-between font-extrabold text-base border-t border-border pt-2 mt-1">
          <span>Total</span>
          <span className="text-green-700">{fmt(grandTotal)}</span>
        </div>
      </div>
    );
  };

  const sym  = CURRENCY_SYMBOLS[currency];
  const rate = CURRENCY_RATES[currency];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} aria-hidden="true" />
      )}

      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-[520px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label={isBuy ? 'Buy now cart' : 'Quote enquiry'}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b border-border shrink-0 ${isBuy ? 'bg-green-50' : 'bg-brand-red-soft/30'}`}>
          <div className="flex items-center gap-2">
            {isBuy
              ? <ShoppingCart size={20} className="text-green-700" />
              : <FileText size={20} className="text-primary" />}
            <h2 className="font-extrabold text-lg">
              {isBuy ? 'Buy Now Cart' : 'Quote Enquiry'}
            </h2>
            {itemCount > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isBuy ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'}`}>
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 hover:bg-muted rounded transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Buy Now: country + currency selectors */}
        {isBuy && (
          <div className="flex gap-2 px-5 py-3 border-b border-border bg-white shrink-0">
            <div className="flex-1 relative">
              <select
                value={country}
                onChange={e => setCountry(e.target.value as Country)}
                className="w-full appearance-none border border-border rounded px-3 py-2 text-xs font-semibold bg-white focus:outline-none focus:border-green-600 pr-7"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="appearance-none border border-border rounded px-3 py-2 text-xs font-semibold bg-white focus:outline-none focus:border-green-600 pr-7"
              >
                <option value="GBP">£ GBP</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {isBuy ? (
            buyCart.length === 0 ? (
              <EmptyState mode="buy" onClose={closeCart} />
            ) : (
              <div className="flex flex-col gap-2">
                {buyCart.map(item => (
                  <BuyItemRow key={item.sku} sku={item.sku} qty={item.qty} country={country} currency={currency} />
                ))}
              </div>
            )
          ) : (
            quoteCart.length === 0 ? (
              <EmptyState mode="quote" onClose={closeCart} />
            ) : (
              <div className="flex flex-col gap-3">
                {quoteCart.map(item => (
                  <QuoteItemRow key={item.sku} sku={item.sku} qty={item.qty} />
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {isBuy && buyCart.length > 0 && (
          <div className="border-t border-border px-5 pt-4 pb-5 flex flex-col gap-3 shrink-0 bg-white">
            {/* Price breakdown */}
            <BuyBreakdown sym={sym} rate={rate} />
            {/* Pay button */}
            <button
              onClick={() => { closeCart(); navigate('/checkout?mode=buy'); }}
              className="w-full bg-green-600 text-white font-extrabold text-sm py-3.5 rounded hover:bg-green-700 active:scale-[0.99] transition-all"
            >
              Proceed to Pay →
            </button>
            <p className="text-[10px] text-muted-foreground text-center">
              Secure payment · All major cards accepted
            </p>
          </div>
        )}

        {!isBuy && quoteCart.length > 0 && (
          <div className="border-t border-border px-5 py-4 flex flex-col gap-3 shrink-0">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded">
              No payment taken at this stage — we will confirm configuration, availability and pricing.
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Items in enquiry:</span>
              <span>{quoteItems}</span>
            </div>
            <Link
              to="/quote"
              onClick={closeCart}
              className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 rounded text-center hover:bg-primary/90 transition-colors"
            >
              Continue to Quote Request →
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
