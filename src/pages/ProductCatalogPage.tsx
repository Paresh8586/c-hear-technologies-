/**
 * ProductCatalogPage  —  /products
 *
 * The new "Products" tab destination.
 * Shows top-level categories (Hardware / Software / Accessories) as large hero
 * tiles, then expands inline to show subcategories when one is clicked.
 * Clicking a subcategory navigates to /products/list?category=X which shows
 * the filtered product grid.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Search, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';
import { TAXONOMY } from '@/lib/taxonomy';

const ProductCatalogPage: React.FC = () => {
  const { products } = useCart();
  const navigate     = useNavigate();
  const [expanded, setExpanded]   = useState<string | null>(null); // top-cat id
  const [searchQ, setSearchQ]     = useState('');

  // product count per actual category string
  const countByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => { map[p.category] = (map[p.category] ?? 0) + 1; });
    return map;
  }, [products]);

  // sub count = sum of counts for all mapped categories
  const subCount = (cats: string[]) =>
    cats.reduce((s, c) => s + (countByCategory[c] ?? 0), 0);

  const topCount = (topId: string) => {
    const top = TAXONOMY.find(t => t.id === topId);
    if (!top) return 0;
    return top.subcategories.reduce((s, sub) => s + subCount(sub.categories), 0);
  };

  // Search: navigate straight to list with query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/products/list?search=${encodeURIComponent(searchQ.trim())}`);
  };

  const toggle = (id: string) =>
    setExpanded(prev => (prev === id ? null : id));

  const goToList = (categories: string[]) => {
    // pass first category; list page supports multi via comma
    navigate(`/products/list?category=${encodeURIComponent(categories[0])}`);
  };

  return (
    <PageLayout>
      <PageMeta
        title="Product Catalogue — Browse IT Hardware & Software"
        description="Browse C-Hear Technologies' full IT product catalogue. Shop hardware, software, networking, security and accessories across 13 categories."
        keywords="product catalogue, IT hardware, software, networking equipment, security products"
      />
      {/* Hero */}
      <section className="bg-brand-black text-white py-14">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">C HEAR CATALOGUE</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Products for modern businesses
          </h1>
          <p className="text-white/60 max-w-xl text-sm mb-8">
            {products.length} products across computing, networking, security, software and business technology.
            Select a category below or search directly.
          </p>
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search by name, SKU, brand…"
                className="w-full bg-white/10 border border-white/20 rounded pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit"
              className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap">
              Search →
            </button>
          </form>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 flex flex-col gap-6">

          {TAXONOMY.map(top => {
            const isOpen = expanded === top.id;
            const count  = topCount(top.id);
            return (
              <div key={top.id} className="bg-card border border-border rounded-xl overflow-hidden">

                {/* Top-category header (clickable) */}
                <button
                  onClick={() => toggle(top.id)}
                  className="w-full text-left"
                >
                  <div className={`${top.colour} text-white px-6 py-6 flex items-center justify-between gap-4`}>
                    <div className="flex items-center gap-5">
                      <span className="text-5xl leading-none">{top.icon}</span>
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight">{top.label}</h2>
                        <p className="text-white/60 text-sm mt-0.5 max-w-xl">{top.description}</p>
                        <p className="text-white/40 text-xs mt-1">{count} product{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="shrink-0 bg-white/10 rounded-full p-2">
                      {isOpen
                        ? <ChevronDown size={20} />
                        : <ChevronRight size={20} />
                      }
                    </div>
                  </div>
                </button>

                {/* Subcategory grid — shown when expanded */}
                {isOpen && (
                  <div className="px-6 py-6 bg-card">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
                      Browse subcategories
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {top.subcategories.map(sub => {
                        const n = subCount(sub.categories);
                        return (
                          <button
                            key={sub.label}
                            onClick={() => goToList(sub.categories)}
                            className="group text-left border border-border rounded-lg p-4 hover:border-primary hover:bg-brand-red-soft transition-all flex flex-col gap-2"
                          >
                            <span className="text-3xl leading-none">{sub.icon}</span>
                            <p className="font-extrabold text-sm group-hover:text-primary transition-colors">
                              {sub.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                              {sub.description}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground mt-auto">
                              {n > 0 ? `${n} product${n !== 1 ? 's' : ''}` : 'View →'}
                            </p>
                          </button>
                        );
                      })}

                      {/* "View all in category" shortcut */}
                      <button
                        onClick={() => navigate(`/products/list?topcat=${top.id}`)}
                        className="group text-left border border-dashed border-border rounded-lg p-4 hover:border-primary hover:bg-brand-red-soft transition-all flex flex-col justify-center items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <ArrowRight size={22} />
                        <p className="font-bold text-xs text-center">
                          View all {top.label}
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick-access all products */}
          <div className="border border-dashed border-border rounded-xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-extrabold text-sm">Browse the full catalogue</p>
              <p className="text-xs text-muted-foreground mt-0.5">See all {products.length} products with advanced filters, search and sorting.</p>
            </div>
            <button
              onClick={() => navigate('/products/list')}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded hover:bg-primary/90 transition-colors shrink-0"
            >
              All Products <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default ProductCatalogPage;
