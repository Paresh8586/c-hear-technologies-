import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShieldCheck, Truck, Tag, ShoppingCart, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import CategorySpecs from '@/components/product/CategorySpecs';
import VariantSelector from '@/components/product/VariantSelector';
import { useCart } from '@/contexts/CartContext';
import { CATEGORY_ICONS, stockStatus, formatMoney } from '@/types/product';
import { applyMargin } from '@/lib/pricing';

const ProductDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sku = searchParams.get('sku') ?? '';
  const { products, addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.sku === sku);

  // Initialise each variant's first option as default selection
  const defaultSelected = useMemo(() => {
    if (!product?.variants) return {};
    return Object.fromEntries(
      product.variants.map(v => [v.label, v.options[0] ?? ''])
    );
  }, [product]);

  const [selected, setSelected] = useState<Record<string, string>>(defaultSelected);
  const [qty, setQty] = useState(1);

  const handleVariantChange = (label: string, option: string) => {
    setSelected(prev => ({ ...prev, [label]: option }));
  };

  const unitPrice  = product?.price != null ? applyMargin(product.price) : null;
  const totalPrice = unitPrice != null ? unitPrice * qty : null;

  const handleAddToCart = () => {
    if (!sku) return;
    for (let i = 0; i < qty; i++) addToCart(sku, 'quote');
    openCart('quote');
    toast.success(product ? `${qty}× ${product.name} added to your quote enquiry` : 'Product added to quote enquiry');
  };

  const handleQuote = () => {
    if (!sku) return;
    addToCart(sku, 'quote');
    navigate('/quote');
  };

  const handleBuyNow = () => {
    if (!sku) return;
    for (let i = 0; i < qty; i++) addToCart(sku, 'buy');
    toast.success(product ? `${qty}× ${product.name} added — proceeding to checkout` : 'Product added — proceeding to checkout');
    navigate('/checkout?mode=buy');
  };

  if (products.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-24 text-center text-muted-foreground">
          <p>Loading product…</p>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-24 text-center">
          <Package size={64} className="mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="text-2xl font-extrabold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The SKU <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{sku}</code> does not exist in the catalogue.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded hover:bg-primary/90 transition-colors">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </PageLayout>
    );
  }

  const hasSpecs    = product.specs   && Object.keys(product.specs).length > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const stock       = stockStatus(product.stock_qty);
  const stockClasses = {
    in:      'bg-green-100 text-green-700',
    low:     'bg-amber-100 text-amber-700',
    out:     'bg-red-100 text-red-700',
    unknown: 'bg-muted text-muted-foreground',
  }[stock.level];
  const canBuy = stock.level !== 'out';

  return (
    <PageLayout>
      <PageMeta
        title={product ? `${product.name} — C-Hear Technologies` : 'Product Detail — C-Hear Technologies'}
        description={product ? `${product.description ?? `Buy ${product.name} from C-Hear Technologies.`} SKU: ${product.sku}. Request a quote or buy direct.` : 'View product specifications, pricing and availability. Request a quote from C-Hear Technologies.'}
        keywords={product ? `${product.name}, ${product.brand}, ${product.category}, IT hardware, buy online` : 'product detail, IT hardware, buy online, specifications'}
      />
      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left column: image + specs table */}
          <div className="space-y-6">
            <div className="bg-muted border border-border rounded-lg flex items-center justify-center h-64 md:h-80">
              <span className="text-[120px] text-primary/30 select-none">
                {CATEGORY_ICONS[product.category] ?? '📦'}
              </span>
            </div>
            {hasSpecs && (
              <CategorySpecs category={product.category} specs={product.specs!} />
            )}
          </div>

          {/* Right column: product info + variants + purchase panel */}
          <div>
            {/* Category + SKU badge */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="bg-brand-red-soft text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{product.sku}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-balance">{product.name}</h1>
            <p className="font-bold text-base mb-0.5">{product.brand}</p>
            <p className="text-sm text-muted-foreground mb-4">{product.model}</p>
            <p className="text-sm text-foreground/80 mb-6 leading-relaxed">{product.description}</p>

            {/* Variant picker */}
            {hasVariants && (
              <VariantSelector
                variants={product.variants!}
                selected={selected}
                onChange={handleVariantChange}
              />
            )}

            {/* Core info strip */}
            <div className="border border-border rounded divide-y divide-border mb-5">
              <div className="flex items-center gap-3 px-4 py-3">
                <Package size={15} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-4 items-center">
                  <span className="text-sm font-semibold">Stock</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide ${stockClasses}`}>
                    {stock.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Truck size={15} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-4">
                  <span className="text-sm font-semibold">Availability</span>
                  <span className="text-sm text-muted-foreground text-right">{product.availability ?? 'Quote / Confirm Stock'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <ShieldCheck size={15} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-4">
                  <span className="text-sm font-semibold">Warranty</span>
                  <span className="text-sm text-muted-foreground text-right">{product.warranty ?? 'To be confirmed'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Tag size={15} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-4 items-center">
                  <span className="text-sm font-semibold">Unit Price</span>
                  {unitPrice != null ? (
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-primary">
                        {formatMoney(unitPrice)} <span className="text-xs font-normal text-muted-foreground">ex-VAT</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">+VAT & delivery at checkout</p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Price on request</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Package size={15} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0 flex justify-between gap-4">
                  <span className="text-sm font-semibold">SKU</span>
                  <span className="text-sm text-muted-foreground font-mono">{product.sku}</span>
                </div>
              </div>
            </div>

            {/* ── Buy Now Panel ─────────────────────────────────────────── */}
            {canBuy && unitPrice != null && (
              <div className="border-2 border-primary rounded-lg p-5 mb-4 bg-brand-red-soft">

                {/* Unit price — always shown for 1 unit */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-0.5">Price per unit</p>
                    <p className="text-2xl font-extrabold text-primary leading-none">
                      {formatMoney(unitPrice)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">ex-VAT · +VAT & delivery at checkout</p>
                  </div>
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Buy Now
                  </span>
                </div>

                {/* Quantity dropdown + live total */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="buy-qty" className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                      Quantity
                    </label>
                    <div className="relative">
                      <select
                        id="buy-qty"
                        value={qty}
                        onChange={e => setQty(Number(e.target.value))}
                        className="appearance-none border border-border rounded bg-white px-3 py-2.5 pr-8 text-sm font-extrabold focus:outline-none focus:border-primary cursor-pointer min-w-[80px]"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n} unit{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Live total — only shown when qty > 1 */}
                  {qty > 1 && (
                    <div className="flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground mb-1">
                        Total ({qty} units)
                      </p>
                      <p className="text-xl font-extrabold text-primary leading-none">
                        {formatMoney(totalPrice!)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {qty} × {formatMoney(unitPrice)} ex-VAT
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-primary text-primary-foreground font-extrabold py-3.5 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart size={16} />
                  Buy Now — {formatMoney(totalPrice!)} ex-VAT
                  {qty > 1 && <span className="opacity-75 font-normal text-xs">({qty} units)</span>}
                </button>
              </div>
            )}

            {/* Out of stock notice */}
            {stock.level === 'out' && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-sm font-semibold px-4 py-3 rounded mb-4 text-center">
                Currently out of stock — use Request a Quote to check availability
              </div>
            )}

            {/* ── Request a Quote (independent) ────────────────────────── */}
            <div className="border border-border rounded-lg p-5 bg-card">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Request a Quote</p>
              <p className="text-xs text-muted-foreground mb-4">
                Need a custom configuration, volume pricing, or have specific requirements? Our team will prepare a tailored quotation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleQuote}
                  className="flex-1 bg-foreground text-background font-bold py-3 rounded hover:bg-foreground/90 transition-colors text-sm"
                >
                  Request a Quote
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-border text-foreground font-bold py-3 rounded hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  Add to Enquiry
                </button>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-5"
            >
              <ArrowLeft size={14} /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
