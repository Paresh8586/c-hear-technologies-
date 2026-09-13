import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';
import type { Currency } from '@/types/product';
import { CATEGORY_ICONS, CATEGORY_IMAGES, SPEC_LABELS, formatMoney, stockStatus } from '@/types/product';
import { TAXONOMY } from '@/lib/taxonomy';
import { applyMargin } from '@/lib/pricing';

/** Pick the 2 most informative spec keys to surface on the card thumbnail */
const CARD_SPEC_KEYS: Record<string, string[]> = {
  'Laptops & Computers':     ['processor', 'memory'],
  'Monitors & Displays':     ['resolution', 'display_type'],
  'Printers & Imaging':      ['type', 'speed'],
  'Networking':              ['type', 'speed'],
  'Servers & Data Centre':   ['form_factor', 'processor'],
  'Storage':                 ['type', 'capacity'],
  'Power & UPS':             ['topology', 'form_factor'],
  'Accessories':             ['type', 'connection'],
  'CCTV & Security':         ['type', 'resolution'],
  'Software & Licensing':    ['tier', 'includes'],
  'Cybersecurity':           ['type', 'includes'],
  'Meeting & Collaboration': ['type', 'room_size'],
  'Cabling & Racks':         ['type', 'standard'],
};

/**
 * Expand a `topcat` slug into the full list of product category strings
 * that belong to that top-level group.
 */
function resolveCategoriesForTop(topId: string): string[] {
  const top = TAXONOMY.find(t => t.id === topId);
  if (!top) return [];
  return top.subcategories.flatMap(s => s.categories);
}

const ProductListPage: React.FC = () => {
  const PAGE_SIZE = 48;
  const { products, addToCart, openCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Support ?category=X (single), ?topcat=hardware, and ?search=q
  const paramCat    = searchParams.get('category') ?? '';
  const paramTop    = searchParams.get('topcat')   ?? '';
  const paramSearch = searchParams.get('search')   ?? '';

  const [search, setSearch]     = useState(paramSearch);
  const [category, setCategory] = useState(paramCat);
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [page, setPage] = useState(1);

  // If topcat param given, pre-filter to those categories (no single-cat lock)
  const topcatCategories = useMemo(
    () => (paramTop ? resolveCategoriesForTop(paramTop) : []),
    [paramTop]
  );

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      const matchSearch = !q || [p.name, p.brand, p.model, p.sku, p.category].join(' ').toLowerCase().includes(q);
      const matchCat    = !category || p.category === category;
      const matchTop    = topcatCategories.length === 0 || topcatCategories.includes(p.category);
      return matchSearch && matchCat && matchTop;
    });
  }, [products, search, category, topcatCategories]);

  useEffect(() => {
    setPage(1);
  }, [search, category, paramTop]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleQuote = (sku: string, name: string) => {
    addToCart(sku, 'quote');
    openCart('quote');
    toast.success(`${name} added to your quote enquiry`);
  };

  const handleBuyNow = (sku: string, name: string) => {
    addToCart(sku, 'buy');
    toast.success(`${name} added — proceeding to checkout`);
    navigate('/checkout?mode=buy');
  };

  // Breadcrumb label for the active filter
  const activeTop = paramTop ? TAXONOMY.find(t => t.id === paramTop) : null;

  return (
    <PageLayout>
      <PageMeta
        title="Shop IT Products — C-Hear Technologies Hardware & Software"
        description="Browse and filter 79 IT products from C-Hear Technologies. Find computers, networking, security, software and accessories. Request a quote or buy direct."
        keywords="buy IT hardware, shop technology, IT products online, computer hardware, business software"
      />
      {/* Page hero */}
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            {activeTop ? (
              <span className="text-white font-semibold">{activeTop.label}</span>
            ) : paramCat ? (
              <span className="text-white font-semibold">{paramCat}</span>
            ) : (
              <span className="text-white font-semibold">All Products</span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {activeTop ? activeTop.label : paramCat || 'All Products'}
          </h1>
          <p className="text-white/60 max-w-2xl text-sm">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found.
            {activeTop && ` ${activeTop.description}`}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border sticky top-[80px] z-30 shadow-sm">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Back to categories */}
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1 text-xs text-muted-foreground font-semibold hover:text-primary transition-colors shrink-0 border border-border rounded px-2 py-1.5"
            >
              <ArrowLeft size={12} /> Categories
            </button>
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, SKU, brand…"
                className="w-full border border-border rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <SlidersHorizontal size={14} />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="">All subcategories</option>
              {(topcatCategories.length > 0
                ? categories.filter(c => topcatCategories.includes(c))
                : categories
              ).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as Currency)}
              className="border-2 border-primary rounded px-3 py-2 text-sm font-extrabold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              title="Display Currency"
            >
              <option value="GBP">£ GBP</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
            <span className="text-xs text-muted-foreground ml-1 shrink-0">{filtered.length} items</span>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-lg font-semibold mb-2">No products found</p>
              <p className="text-sm mb-4">Try adjusting your search or filter.</p>
              <button onClick={() => navigate('/products')} className="text-primary font-bold text-sm hover:underline">
                ← Back to categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pagedProducts.map(p => {
                const cardKeys       = CARD_SPEC_KEYS[p.category] ?? [];
                const labelMap       = SPEC_LABELS[p.category] ?? {};
                const specHighlights = cardKeys
                  .filter(k => p.specs?.[k])
                  .map(k => ({ label: labelMap[k] ?? k.replace(/_/g, ' '), value: p.specs![k] }));
                const variantCount = p.variants?.length ?? 0;
                const stock        = stockStatus(p.stock_qty);
                const stockClasses = {
                  in:      'bg-green-100 text-green-700',
                  low:     'bg-amber-100 text-amber-700',
                  out:     'bg-red-100 text-red-700',
                  unknown: 'bg-muted text-muted-foreground',
                }[stock.level];
                return (
                  <article key={p.sku} className="bg-card border border-border rounded flex flex-col hover:shadow-hover transition-shadow group">
                    <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                      <span className="absolute top-3 left-3 bg-brand-red-soft text-primary text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide">
                        {p.brand}
                      </span>
                      {variantCount > 0 && (
                        <span className="absolute top-3 right-3 bg-brand-black text-white text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide">
                          {variantCount} option{variantCount > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className={`absolute bottom-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${stockClasses}`}>
                        {stock.label}
                      </span>
                      {CATEGORY_IMAGES[p.category] ? (
                        <img src={CATEGORY_IMAGES[p.category]} alt="" className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-primary/40 group-hover:text-primary transition-colors text-4xl">
                          {CATEGORY_ICONS[p.category] ?? '📦'}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                      <h3 className="font-extrabold text-sm leading-snug mt-1 mb-1 text-balance">{p.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      {specHighlights.length > 0 && (
                        <div className="mt-2 space-y-0.5">
                          {specHighlights.map(({ label, value }) => (
                            <div key={label} className="flex gap-1.5 text-[10px]">
                              <span className="text-muted-foreground shrink-0">{label}:</span>
                              <span className="font-semibold text-foreground truncate">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-2">MPN: {p.mpn ?? p.sku}</p>
                      <p className="text-[10px] text-muted-foreground">{p.availability ?? 'Quote / Confirm Stock'}</p>
                      {p.price != null ? (
                        <div className="mt-1">
                          <p className="text-xs font-extrabold text-primary">
                            From {formatMoney(applyMargin(p.price), currency)} <span className="font-normal text-muted-foreground">ex-VAT</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-muted-foreground mt-1">Price on request</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => navigate(`/product?sku=${encodeURIComponent(p.sku)}`)}
                          className="flex-1 border border-border text-foreground text-xs font-bold py-2 rounded hover:border-primary hover:text-primary transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleQuote(p.sku, p.name)}
                          className="flex-1 border border-primary text-primary text-xs font-bold py-2 rounded hover:bg-brand-red-soft transition-colors"
                        >
                          Request Quote
                        </button>
                        <button
                          onClick={() => handleBuyNow(p.sku, p.name)}
                          className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded hover:bg-primary/90 transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setPage(current => Math.max(1, current - 1))}
                disabled={page === 1}
                className="border border-border rounded px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:border-primary hover:text-primary"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage(current => Math.min(pageCount, current + 1))}
                disabled={page === pageCount}
                className="border border-border rounded px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:border-primary hover:text-primary"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default ProductListPage;
