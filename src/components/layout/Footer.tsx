import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Upload, FileText, Receipt, ChevronDown, LogIn, LogOut, Phone, Mail, Facebook, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TAXONOMY } from '@/lib/taxonomy';
import { toast } from 'sonner';

const STAFF_LINKS = [
  { label: 'Stock Import',    path: '/admin/stock',   icon: <Upload size={13} /> },
  { label: 'Quote Builder',   path: '/admin/quote',   icon: <FileText size={13} /> },
  { label: 'Invoice Builder', path: '/admin/invoice', icon: <Receipt size={13} /> },
];

const Footer: React.FC = () => {
  const [staffOpen, setStaffOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { user, profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks! We will add you to our updates list.');
    setEmail('');
  };

  return (
    <footer className="bg-brand-black text-white mt-auto">

      {/* Newsletter / CTA strip */}
      <div className="border-b border-white/10 bg-primary/10">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-extrabold text-lg text-white">Stay up to date with our latest products</p>
              <p className="text-white/50 text-sm mt-1">New products, pricing updates and technology news from C-Hear.</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-0 min-w-0">
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your business email"
                className="flex-1 md:w-72 border border-white/20 bg-white/5 text-white placeholder-white/30 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white font-bold px-4 py-2.5 rounded-r-lg hover:bg-primary/90 transition-colors whitespace-nowrap text-sm flex items-center gap-1.5">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="mb-4 inline-flex rounded-xl bg-white px-4 py-2">
              <img src="/assets/logo/chear-logo.png" alt="C HEAR" className="h-14 w-auto object-contain" />
            </div>
            <h3 className="font-extrabold text-base mb-2">C Hear Technologies Limited</h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed max-w-xs">
              Genuine IT hardware and software supplies for business. Quality products, competitive prices, reliable support.
            </p>
            <div className="flex flex-col gap-2 mb-5">
              <a href="tel:+442038078262" className="flex items-center gap-2 text-white/50 text-sm hover:text-primary transition-colors">
                <Phone size={13} /> 0203 807 8262
              </a>
              <a href="mailto:info@c-hear.co.uk" className="flex items-center gap-2 text-white/50 text-sm hover:text-primary transition-colors">
                <Mail size={13} /> info@c-hear.co.uk
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/people/C-Hear-Technologies/61554351617790/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"><Facebook size={14} /></a>
              <a href="https://www.linkedin.com/company/c-hear-technologies" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"><Linkedin size={14} /></a>
              <a href="https://twitter.com/CHearTech" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"><Twitter size={14} /></a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-primary">Products</h3>
            <div className="flex flex-col gap-2">
              {TAXONOMY.map(t => (
                <Link key={t.id} to={`/products?topcat=${t.id}`} className="text-white/50 text-sm hover:text-primary transition-colors">
                  {t.label}
                </Link>
              ))}
              <Link to="/products" className="text-white/50 text-sm hover:text-primary transition-colors font-semibold">
                View All Products →
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-primary">Company</h3>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-white/50 text-sm hover:text-primary transition-colors">About Us</Link>
              <Link to="/solutions" className="text-white/50 text-sm hover:text-primary transition-colors">Solutions</Link>
              <Link to="/services" className="text-white/50 text-sm hover:text-primary transition-colors">Services</Link>
              <Link to="/contact" className="text-white/50 text-sm hover:text-primary transition-colors">Contact</Link>
              <Link to="/quote" className="text-white/50 text-sm hover:text-primary transition-colors">Request a Quote</Link>
              <Link to="/terms" className="text-white/50 text-sm hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-primary">Get in Touch</h3>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Phone</p>
                <a href="tel:+442038078262" className="text-white/60 text-sm hover:text-primary transition-colors">0203 807 8262</a>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">General</p>
                <a href="mailto:info@c-hear.co.uk" className="text-white/60 text-sm hover:text-primary transition-colors">info@c-hear.co.uk</a>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Sales</p>
                <a href="mailto:sales@c-hear.co.uk" className="text-white/60 text-sm hover:text-primary transition-colors">sales@c-hear.co.uk</a>
              </div>
              <div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Hours</p>
                <p className="text-white/60 text-xs leading-relaxed">Mon–Fri: 9:00–18:00 GMT<br />Sat: 10:00–14:00 GMT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between gap-3 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} C Hear Technologies Limited. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-white/60 transition-colors underline underline-offset-2">Terms & Conditions</Link>
            <span>Prices, stock, tax and configurations are confirmed before fulfilment.</span>
          </div>
        </div>

        {/* Staff Portal */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setStaffOpen(o => !o)}
            className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors text-[11px] select-none"
            aria-label="Staff portal"
          >
            <Lock size={10} />
            <span>Staff Portal</span>
            {user && <span className="text-white/30 font-mono">({profile?.username ?? user.email?.split('@')[0]})</span>}
            <ChevronDown size={10} className={`transition-transform ${staffOpen ? 'rotate-180' : ''}`} />
          </button>

          {staffOpen && (
            <div className="mt-3 flex flex-wrap gap-3 items-center">
              {!user && (
                <Link to="/admin/login" className="flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white/90 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 hover:border-white/20">
                  <LogIn size={13} /> Sign In to Staff Portal
                </Link>
              )}
              {user && !isAdmin && (
                <span className="text-[11px] text-amber-400/70 px-3 py-1.5">Access pending — contact an admin to upgrade your role.</span>
              )}
              {isAdmin && STAFF_LINKS.map(link => (
                <Link key={link.path} to={link.path} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/80 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 hover:border-white/20">
                  {link.icon} {link.label}
                </Link>
              ))}
              {user && (
                <button onClick={() => signOut()} className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1.5">
                  <LogOut size={11} /> Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
