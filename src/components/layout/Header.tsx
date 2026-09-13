import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { TAXONOMY } from '@/lib/taxonomy';

const TOP_CATEGORIES = TAXONOMY.map(t => ({
  id: t.id,
  label: t.label,
  icon: t.icon,
  desc: t.description,
  subs: t.subcategories.slice(0, 6),
}));

const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Solutions',  path: '/solutions' },
  { label: 'Services',   path: '/services' },
  { label: 'About Us',   path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

const Header: React.FC = () => {
  const { buyItems, openCart, products } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products/list?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 overflow-x-hidden w-full ${scrolled ? 'shadow-md border-b border-border' : 'border-b border-border'}`}>
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 w-full">
        <div className="flex items-center gap-4 min-h-[80px] min-w-0">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 mr-2">
            <img src="/assets/logo/chear-logo.png" alt="C HEAR Technologies" className="h-16 w-auto object-contain" />
            <div className="hidden xl:block">
              <div className="font-extrabold text-base leading-tight tracking-tight text-foreground">
                C Hear Technologies Limited
              </div>
              <div className="text-primary text-xs font-semibold">www.c-hear.co.uk</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0 ml-auto">
            {/* Products mega-dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setProductsOpen(o => !o)}
                onMouseEnter={() => setProductsOpen(true)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  productsOpen ? 'text-primary border-primary bg-muted' : 'text-foreground border-transparent bg-muted/40 hover:text-primary hover:border-primary hover:bg-muted'
                }`}
              >
                Products
                <ChevronDown size={14} className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega-menu */}
              {productsOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[720px] bg-white border border-border rounded-b-lg shadow-xl z-50"
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-0 p-4">
                    {TOP_CATEGORIES.map(tc => (
                      <div key={tc.id} className="p-3">
                        <Link
                          to={`/products?topcat=${tc.id}`}
                          onClick={() => setProductsOpen(false)}
                          className="flex items-center gap-2 font-extrabold text-sm text-foreground hover:text-primary mb-2 group"
                        >
                          <span className="text-base">{tc.icon}</span>
                          <span className="group-hover:underline">{tc.label}</span>
                        </Link>
                        <div className="flex flex-col gap-1 pl-6 border-l border-border">
                          {tc.subs.map(s => (
                            <Link
                              key={s.label}
                              to={`/products/list?category=${encodeURIComponent(s.categories[0])}`}
                              onClick={() => setProductsOpen(false)}
                              className="text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border px-4 py-3 bg-muted/40 flex items-center justify-between rounded-b-lg">
                    <p className="text-xs text-muted-foreground">
                      {products.length > 0 ? products.length.toLocaleString() : '6,000+'} products across 24 categories
                    </p>
                    <Link
                      to="/products"
                      onClick={() => setProductsOpen(false)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Browse full catalogue →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'text-primary border-primary bg-muted'
                      : 'text-foreground border-transparent bg-muted/40 hover:text-primary hover:border-primary hover:bg-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-4 shrink-0">
            {/* Search toggle */}
            <div className="relative hidden md:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder="Search products…"
                    className="border border-border rounded-l px-3 py-2 text-sm w-52 focus:outline-none focus:border-primary"
                  />
                  <button type="submit" className="border border-l-0 border-border bg-primary text-white rounded-r px-3 py-2 hover:bg-primary/90">
                    <Search size={16} />
                  </button>
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 p-1.5 text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 border border-border rounded hover:border-primary transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => openCart('buy')}
              className="relative p-2 border border-border rounded hover:border-green-600 transition-colors"
              aria-label="Open buy now cart"
            >
              <ShoppingCart size={18} />
              {buyItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {buyItems}
                </span>
              )}
            </button>

            {/* Phone — visible on lg+ */}
            <a
              href="tel:+442038078262"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={14} />
              0203 807 8262
            </a>

            <Link
              to="/quote"
              className="hidden md:inline-flex items-center bg-primary text-primary-foreground font-bold text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Get a Quote
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 border border-border rounded"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-border">
            <form onSubmit={e => { handleSearch(e); setMobileOpen(false); }} className="flex gap-2">
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products…"
                className="flex-1 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white rounded px-3 py-2">
                <Search size={16} />
              </button>
            </form>
          </div>
          <nav className="flex flex-col py-2">
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="px-6 py-3 text-sm font-semibold border-l-4 border-transparent hover:text-primary hover:bg-muted hover:border-primary"
            >
              Products
            </Link>
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-semibold border-l-4 ${
                    isActive
                      ? 'text-primary border-primary bg-muted'
                      : 'text-foreground border-transparent hover:text-primary hover:bg-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/quote"
              onClick={() => setMobileOpen(false)}
              className="mx-6 mt-3 mb-2 text-center bg-primary text-primary-foreground font-bold text-sm px-4 py-3 rounded"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
