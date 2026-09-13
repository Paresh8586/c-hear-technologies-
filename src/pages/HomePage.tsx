import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, HeadphonesIcon, Shield, Star, ArrowRight, ChevronRight, Quote, Phone, Mail, BadgeCheck, Layers } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';
import type { Product, Currency } from '@/types/product';
import { FEATURED_CATEGORIES, CATEGORY_ICONS, CATEGORY_IMAGES, formatMoney } from '@/types/product';
import { TAXONOMY } from '@/lib/taxonomy';

/* ─── Benefits ─────────────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: <CheckCircle size={22} className="text-primary" />, title: '100% Genuine Products', sub: 'Authentic & quality assured' },
  { icon: <BadgeCheck size={22} className="text-primary" />, title: 'Competitive Pricing', sub: 'Best value for your business' },
  { icon: <Truck size={22} className="text-primary" />, title: 'Fast Delivery', sub: 'On time, every time' },
  { icon: <HeadphonesIcon size={22} className="text-primary" />, title: 'Expert Support', sub: 'Here to help you succeed' },
  { icon: <Shield size={22} className="text-primary" />, title: 'Warranty & Assurance', sub: 'Peace of mind guaranteed' },
];

/* ─── Stats ─────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
];

/* ─── Testimonials ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    body: 'C-Hear supplied all our office workstations on a very tight timeline. Genuine hardware, clear pricing, and delivered exactly as specified.',
    name: 'Operations Manager',
    company: 'London Financial Services Firm',
  },
  {
    body: 'We needed a full networking refresh across two sites. The quotation workflow was clear and the equipment arrived on schedule — no surprises.',
    name: 'IT Director',
    company: 'National Retail Group',
  },
  {
    body: 'The software licensing process was seamless. Volume pricing was competitive and the team resolved our configuration queries immediately.',
    name: 'Head of IT',
    company: 'Property Management Company',
  },
];

/* ─── Animated stat counter ─────────────────────────────────────────────── */
const CountUp: React.FC<{ target: string }> = ({ target }) => {
  const num = parseInt(target.replace(/\D/g, ''), 10);
  const suffix = target.replace(/[\d]/g, '');
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 40;
        const inc = num / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= num) { setCount(num); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 30);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [num]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── Product card ──────────────────────────────────────────────────────── */
const ProductCard: React.FC<{ product: Product; currency: Currency }> = ({ product, currency }) => {
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const handleQuote = () => {
    addToCart(product.sku, 'quote');
    openCart('quote');
    toast.success(`${product.name} added to your quote enquiry`);
  };

  const handleBuyNow = () => {
    addToCart(product.sku, 'buy');
    toast.success(`${product.name} added — proceeding to checkout`);
    navigate('/checkout?mode=buy');
  };

  return (
    <article className="bg-card border border-border rounded-lg flex flex-col hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-5xl relative overflow-hidden rounded-t-lg">
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide z-10">
          {product.brand}
        </span>
        {CATEGORY_IMAGES[product.category] ? (
          <img src={CATEGORY_IMAGES[product.category]} alt="" className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-primary/30 group-hover:text-primary/60 transition-colors text-6xl">
            {CATEGORY_ICONS[product.category] ?? '📦'}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{product.category}</p>
        <h3 className="font-extrabold text-sm leading-snug mt-1 mb-1 text-balance">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-extrabold text-primary">{formatMoney(product.price, currency)}</p>
          <p className="text-[10px] text-muted-foreground">{product.availability ?? 'Confirm Stock'}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/product?sku=${encodeURIComponent(product.sku)}`)}
            className="flex-1 border border-border text-foreground text-xs font-bold py-2 rounded hover:border-primary hover:text-primary transition-colors"
          >
            View
          </button>
          <button onClick={handleBuyNow} className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700 transition-colors">
            Buy Now
          </button>
          <button onClick={handleQuote} className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded hover:bg-primary/90 transition-colors">
            Quote
          </button>
        </div>
      </div>
    </article>
  );
};

/* ─── Home Page ─────────────────────────────────────────────────────────── */
const HomePage: React.FC = () => {
  const { products } = useCart();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [quoteForm, setQuoteForm] = useState({ name: '', company: '', email: '', message: '' });

  const categories = [...new Set(products.map(p => p.category))].sort();
  const productCountLabel = products.length > 0 ? `${products.length.toLocaleString()}+` : '6,000+';

  const featured = products
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || [p.name, p.brand, p.model, p.sku, p.category].join(' ').toLowerCase().includes(q);
      const matchCat = !category || p.category === category;
      return matchSearch && matchCat;
    })
    .slice(0, 6);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Website Quote Request – C Hear Technologies');
    const body = encodeURIComponent(
      `Name: ${quoteForm.name}\nCompany: ${quoteForm.company || '—'}\nEmail: ${quoteForm.email}\n\nRequirements:\n${quoteForm.message}`
    );
    window.location.href = `mailto:sales@c-hear.co.uk?subject=${subject}&body=${body}`;
    toast.success('Quote request sent! We will be in touch shortly.');
    setQuoteForm({ name: '', company: '', email: '', message: '' });
  };

  return (
    <PageLayout>
      <PageMeta
        title="C-Hear Technologies — IT Hardware & Software Supplier"
        description="C-Hear Technologies supplies genuine IT hardware and software for businesses. Browse our extensive product catalogue, get a quote, or buy direct."
        keywords="IT hardware supplier, business technology, computer hardware, software licensing, IT equipment"
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black min-h-[560px]">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.4) 40px,rgba(255,255,255,.4) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.4) 40px,rgba(255,255,255,.4) 41px)' }} />
        {/* Red diagonal accent */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/10 [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)] hidden md:block" />

        <div className="relative max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center min-h-[560px] py-16">
            <div className="md:col-span-3 relative z-10">
              <div className="inline-flex items-center gap-2 bg-transparent text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                <BadgeCheck size={12} /> Trusted B2B Technology Partner
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white mb-5">
                Your Business.<br />
                <span className="text-primary">Powered by</span><br />
                the Right Tech.
              </h1>
              <p className="text-white/70 text-base max-w-lg mb-8 leading-relaxed">
                Genuine hardware, software and infrastructure — sourced to spec, priced competitively, and delivered to UK businesses with expert support at every stage.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3.5 rounded hover:bg-primary/90 transition-colors text-sm">
                  Browse Products <ArrowRight size={16} />
                </Link>
                <Link to="/quote" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold px-7 py-3.5 rounded hover:border-white/60 hover:bg-white/5 transition-colors text-sm">
                  Request a Quote
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 mt-10">
                <a href="tel:+442038078262" className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
                  <Phone size={14} /> 0203 807 8262
                </a>
                <a href="mailto:sales@c-hear.co.uk" className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
                  <Mail size={14} /> sales@c-hear.co.uk
                </a>
              </div>
            </div>
            <div className="md:col-span-2 hidden md:flex -translate-y-10 flex-col items-center justify-center">
              <img
                src="/assets/hero/technology-hero.png"
                alt="Business technology"
                className="relative -translate-x-6 w-[calc(100%+3rem)] max-w-none h-80 object-contain object-center rounded-xl opacity-80"
              />
              <p className="mt-2 max-w-sm text-center text-base font-bold leading-snug tracking-wide md:text-lg">
                <span className="text-primary">Technology that works</span>{' '}
                <span className="text-white">as hard as your business.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits bar ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white shadow-sm">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
            {BENEFITS.map(b => (
              <div key={b.title} className="flex items-center gap-3 py-5 px-5">
                <div className="shrink-0">{b.icon}</div>
                <div>
                  <p className="font-bold text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="text-center mb-10">
            <p className="eyebrow-label mb-2">SHOP BY CATEGORY</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Explore Our Product Range</h2>
            <span className="red-accent-line mx-auto mt-3" />
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
              24 product categories across hardware, software, networking, security, and peripherals.
            </p>
          </div>

          {/* Top-level category tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {TAXONOMY.map(tc => (
              <Link
                key={tc.id}
                to={`/products/list?topcat=${tc.id}`}
                className="group bg-white border border-border rounded-lg p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-1 hover:shadow-hover transition-all duration-200"
              >
                <span className="text-3xl">{tc.icon}</span>
                <p className="font-bold text-sm text-balance leading-tight">{tc.label}</p>
                <p className="text-xs text-muted-foreground hidden md:block leading-tight">
                  {tc.subcategories.length} subcategories
                </p>
                <span className="text-xs text-primary font-semibold group-hover:underline">Browse →</span>
              </Link>
            ))}
          </div>

          {/* Featured category images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURED_CATEGORIES.slice(0, 6).map(cat => (
              <Link
                key={cat.slug}
                to={`/products/list?category=${encodeURIComponent(cat.slug)}`}
                className="group border border-border rounded-lg overflow-hidden bg-white hover:-translate-y-1 hover:shadow-hover transition-all duration-200"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="py-2.5 px-3 text-center">
                  <p className="font-bold text-xs text-balance leading-snug">{cat.name} <span className="text-primary">→</span></p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              View all 24 categories <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[{ value: productCountLabel, label: 'Products Available' }, ...STATS].map(s => (
              <div key={s.label} className="flex flex-col items-center py-8 px-4 text-center">
                <p className="text-5xl font-extrabold text-white mb-2 tracking-tight">
                  <CountUp target={s.value} />
                </p>
                <p className="text-sm text-white/70 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Catalogue ───────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow-label mb-1">FEATURED CATALOGUE</p>
              <h2 className="text-3xl font-extrabold tracking-tight">Business Technology, Ready to Order</h2>
              <p className="text-sm text-muted-foreground mt-1">{featured.length} items shown · {products.length} total in catalogue</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="border border-border rounded px-3 py-2 text-sm min-w-[180px] bg-white focus:outline-none focus:border-primary"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                className="border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option>GBP</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(p => <ProductCard key={p.sku} product={p} currency={currency} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">No products matched your search.</p>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3.5 rounded hover:bg-brand-red-soft transition-colors">
              View Full Catalogue <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Solutions band ───────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="text-center mb-10">
            <p className="eyebrow-label mb-2">BUSINESS SOLUTIONS</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Technology that Supports How You Work</h2>
            <span className="red-accent-line mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '💻', title: 'Business Computing', desc: 'Laptops, desktops and workstations for every business role and budget.', path: '/products/list?category=Laptops+%26+Computers' },
              { icon: '🌐', title: 'Network Infrastructure', desc: 'Switches, access points, routers, firewalls and structured cabling.', path: '/products/list?category=Networking' },
              { icon: '🔒', title: 'Security & Surveillance', desc: 'CCTV, access control and endpoint protection for premises and data.', path: '/products/list?category=CCTV+%26+Security' },
              { icon: '💿', title: 'Software & Licensing', desc: 'Microsoft 365, Windows, Server OS and volume licence management.', path: '/products/list?category=Software+%26+Licensing' },
              { icon: '📹', title: 'Meeting & Collaboration', desc: 'Conference cameras, speakerphones and hybrid meeting room systems.', path: '/products/list?category=Meeting+%26+Collaboration' },
              { icon: '☁️', title: 'Cloud & Managed Services', desc: 'Azure, Microsoft 365 and fully managed IT support contracts.', path: '/solutions' },
            ].map(s => (
              <Link key={s.title} to={s.path} className="group bg-white border border-border rounded-lg p-6 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 flex gap-4 items-start">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div>
                  <h3 className="font-extrabold text-base mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <span className="text-xs font-bold text-primary mt-2 inline-block group-hover:underline">Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-2">HOW IT WORKS</p>
            <h2 className="text-3xl font-extrabold tracking-tight">From Requirement to Delivery</h2>
            <span className="red-accent-line mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
            {[
              { step: '01', title: 'Enquiry', desc: 'Tell us what your business needs via our quote form or direct contact.', icon: '📋' },
              { step: '02', title: 'Specification', desc: 'We confirm the right product model, configuration and current availability.', icon: '⚙️' },
              { step: '03', title: 'Quotation', desc: 'Receive a full quotation with confirmed pricing, warranty and delivery.', icon: '📄' },
              { step: '04', title: 'Fulfilment', desc: 'Order confirmed, goods sourced and delivered to your business.', icon: '🚚' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center px-4 relative">
                <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl mb-4 bg-white z-10 ${i === 0 ? 'border-primary' : 'border-border'}`}>
                  {s.icon}
                </div>
                <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1">{s.step}</p>
                <h3 className="font-extrabold text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/quote" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded hover:bg-primary/90 transition-colors">
              Start Your Enquiry <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-black text-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="text-center mb-10">
            <p className="eyebrow-label mb-2">WHAT OUR CLIENTS SAY</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Trusted by UK Businesses</h2>
            <span className="red-accent-line mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                <Quote size={24} className="text-primary opacity-60" />
                <p className="text-white/80 text-sm leading-relaxed flex-1">"{t.body}"</p>
                <div>
                  <p className="font-bold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Band ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow-label mb-3">C HEAR TECHNOLOGIES LIMITED</p>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-4">
                Technology supply built around your business.
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We supply business technology across computing, networking, infrastructure, security,
                collaboration and software. Products are sourced to order with model, configuration,
                warranty, availability and price confirmed before fulfilment.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                Every product we supply is genuine, properly warranted and suitable for business use —
                sourced through established distribution channels with full manufacturer support.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded hover:bg-primary/90 transition-colors text-sm">
                  About C HEAR
                </Link>
                <Link to="/services" className="border-2 border-primary text-primary font-bold px-5 py-2.5 rounded hover:bg-brand-red-soft transition-colors text-sm">
                  Our Services
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 min-w-0">
              {[
                { value: productCountLabel, label: 'Products in catalogue' },
                { value: '24', label: 'Product categories' },
                { value: '3', label: 'Supported currencies (GBP, USD, EUR)' },
                { value: 'B2B', label: 'Business-first workflow' },
              ].map(f => (
                <div key={f.label} className="bg-muted rounded-lg p-6 border border-border">
                  <p className="text-3xl font-extrabold text-primary">{f.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote CTA ────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-red-soft border-y border-primary/20">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow-label mb-3">REQUEST A QUOTE</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                Tell us what your business needs.
              </h2>
              <p className="text-muted-foreground mb-6">
                Send your requirements and we will prepare a configuration and quotation.
                Pricing and availability are confirmed before any commitment is made.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <span>No upfront payment for quotations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <span>Pricing confirmed before commitment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <span>Genuine products from authorised channels</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleQuoteSubmit} className="bg-white border border-border rounded-xl p-6 flex flex-col gap-3 shadow-sm">
              <h3 className="font-extrabold text-lg mb-1">Quick Quote Request</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <input required value={quoteForm.name} onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))} placeholder="Name *" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <input value={quoteForm.company} onChange={e => setQuoteForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <input required type="email" value={quoteForm.email} onChange={e => setQuoteForm(f => ({ ...f, email: e.target.value }))} placeholder="Email *" className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <textarea required rows={4} value={quoteForm.message} onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))} placeholder="Products or requirements *" className="border border-border rounded px-3 py-2.5 text-sm bg-white resize-none focus:outline-none focus:border-primary" />
              <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Send Quote Request <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
