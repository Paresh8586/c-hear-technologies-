import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, Award, Handshake, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

const FACTS = [
  { value: '6,000+', label: 'Products in catalogue' },
  { value: '24', label: 'Product categories' },
  { value: 'UK', label: 'Primary market' },
  { value: 'B2B', label: 'Business-first workflow' },
];

const VALUES = [
  { icon: <ShieldCheck size={18} className="text-primary shrink-0" />, text: 'Genuine, manufacturer-authentic products only' },
  { icon: <CheckCircle size={18} className="text-primary shrink-0" />, text: 'Configuration and availability confirmed before every sale' },
  { icon: <Award size={18} className="text-primary shrink-0" />, text: 'Transparent quotation workflow with no hidden costs' },
  { icon: <Handshake size={18} className="text-primary shrink-0" />, text: 'Warranty and post-sale support coordination' },
  { icon: <TrendingUp size={18} className="text-primary shrink-0" />, text: 'Business-focused service built for operational needs' },
];

const MILESTONES = [
  { year: '2013', title: 'Founded', desc: 'C-Hear Technologies established as a B2B IT supply business.' },
  { year: '2016', title: 'Expanded', desc: 'Grew catalogue to include networking, CCTV and unified communications.' },
  { year: '2020', title: 'Digital Platform', desc: 'Launched online product catalogue with live stock and pricing.' },
  { year: '2024', title: '6,000+ Products', desc: 'Expanded to a broad supplier catalogue with direct buy and quote workflows.' },
];

const AboutPage: React.FC = () => (
  <PageLayout>
    <PageMeta
      title="About C-Hear Technologies — IT Supplier for Business"
      description="C-Hear Technologies supplies genuine business technology across computing, networking, security and software. Transparent quotation workflow, no hidden costs."
      keywords="about C-Hear, IT supplier, business technology, genuine products, B2B technology"
    />

    {/* Hero */}
    <section className="bg-brand-black text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.3) 20px,rgba(255,255,255,.3) 21px)' }} />
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 relative">
        <p className="eyebrow-label mb-3">ABOUT C HEAR</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl leading-tight">
          Technology supply built around your business.
        </h1>
        <p className="text-white/60 max-w-2xl text-base leading-relaxed">
          C Hear Technologies Limited supplies business technology across computing, networking,
          infrastructure, security, collaboration and software. Every product is genuine, properly
          warranted and priced with transparency.
        </p>
      </div>
    </section>

    {/* Stats bar */}
    <section className="bg-primary text-white border-b border-primary/20">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {FACTS.map(f => (
            <div key={f.label} className="flex flex-col items-center py-8 px-4 text-center">
              <p className="text-4xl font-extrabold text-white mb-1">{f.value}</p>
              <p className="text-sm text-white/70">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Main content */}
    <section className="py-16 bg-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          <div>
            <p className="eyebrow-label mb-3">OUR APPROACH</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-5">
              Professional supply. Practical technology.
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our catalogue is structured for business customers who need reliable sourcing, clear
              specifications and quotation-based fulfilment. Product model, configuration, warranty,
              availability and price are confirmed before fulfilment — every time.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
              We work with established technology brands and distribution channels to ensure that
              every product supplied is genuine, properly warranted and fit for business use. Our
              quote-led workflow means there are no surprises — pricing and configuration are agreed
              up front, before any commitment is made.
            </p>

            <p className="eyebrow-label mb-4">OUR COMMITMENTS</p>
            <ul className="flex flex-col gap-3">
              {VALUES.map(v => (
                <li key={v.text} className="flex items-start gap-3 text-sm bg-muted/30 border border-border rounded-lg px-4 py-3">
                  <div className="mt-0.5">{v.icon}</div>
                  <span className="leading-relaxed">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            {/* Logo card */}
            <div className="border border-border rounded-xl p-8 bg-card flex flex-col items-center text-center shadow-sm">
              <img src="/assets/logo/chear-logo.png" alt="C HEAR Technologies" className="h-20 w-auto object-contain mb-4" />
              <p className="font-extrabold text-xl">C Hear Technologies Limited</p>
              <p className="text-primary text-sm font-semibold mt-1">www.c-hear.online</p>
              <p className="text-muted-foreground text-sm mt-3 max-w-xs leading-relaxed">
                Quality products. Competitive prices. Reliable support.
              </p>
              <div className="flex gap-3 mt-5">
                <Link to="/products" className="bg-primary text-primary-foreground font-bold text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
                  Browse Products
                </Link>
                <Link to="/contact" className="border border-primary text-primary font-bold text-sm px-4 py-2 rounded hover:bg-brand-red-soft transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div className="border border-border rounded-xl p-6 bg-muted/20">
              <p className="eyebrow-label mb-4">OUR JOURNEY</p>
              <div className="flex flex-col gap-0">
                {MILESTONES.map((m, i) => (
                  <div key={m.year} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-extrabold shrink-0 z-10">
                        {m.year.slice(2)}
                      </div>
                      {i < MILESTONES.length - 1 && <div className="w-0.5 h-full bg-border mt-1 mb-1" />}
                    </div>
                    <div className="pb-5 min-h-0">
                      <p className="text-xs font-extrabold text-primary uppercase">{m.year} · {m.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why choose us */}
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="text-center mb-10">
          <p className="eyebrow-label mb-2">WHY C HEAR</p>
          <h2 className="text-3xl font-extrabold tracking-tight">The C-Hear Difference</h2>
          <span className="red-accent-line mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🏷️', title: 'Transparent Pricing', desc: 'All prices confirmed before commitment. Multi-currency support across GBP, USD and EUR for international orders.' },
            { icon: '📦', title: 'Genuine Products', desc: 'Every item sourced through authorised UK distribution channels with full manufacturer warranty coverage.' },
            { icon: '🤝', title: 'Dedicated Support', desc: 'From initial specification through to post-delivery warranty coordination — we are here throughout the product lifecycle.' },
          ].map(c => (
            <div key={c.title} className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-hover transition-all">
              <span className="text-4xl block mb-4">{c.icon}</span>
              <h3 className="font-extrabold text-lg mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-14 bg-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight mb-3">Work with C HEAR</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm leading-relaxed">
          Get in touch to discuss your business technology requirements.
          No upfront commitment — we confirm everything before you order.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors">
            Contact Us <ArrowRight size={16} />
          </Link>
          <Link to="/products" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 py-3 rounded hover:bg-brand-red-soft transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default AboutPage;
