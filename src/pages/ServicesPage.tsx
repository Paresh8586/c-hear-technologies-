import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Wifi, ShieldCheck, Wrench, HeadphonesIcon, FileText, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

const SERVICES = [
  {
    icon: <ShoppingBag size={28} className="text-primary" />,
    title: 'IT Supply',
    description: 'Computers, peripherals, software and infrastructure sourcing. We work with leading brands to provide genuine products at competitive prices, sourced to your exact specification.',
    bullets: ['Genuine manufacturer hardware', 'Full product lifecycle support', 'Volume and single-unit orders'],
  },
  {
    icon: <Wifi size={28} className="text-primary" />,
    title: 'Networking',
    description: 'Wi-Fi, switching, routing, structured cabling and network equipment — from small office setups to enterprise switching and fibre infrastructure.',
    bullets: ['Cisco, HPE, Ubiquiti, TP-Link', 'Site survey and planning support', 'Scalable from 5 to 500+ users'],
  },
  {
    icon: <ShieldCheck size={28} className="text-primary" />,
    title: 'Security',
    description: 'CCTV, access control, storage and cybersecurity product supply to protect your premises and data with the right physical and digital security tools.',
    bullets: ['IP cameras and NVR systems', 'Endpoint protection software', 'Access control and biometrics'],
  },
  {
    icon: <Wrench size={28} className="text-primary" />,
    title: 'Deployment',
    description: 'Installation and configuration workflows developed around your requirements. We support the full product lifecycle from specification through to deployment.',
    bullets: ['Pre-configured device imaging', 'On-site installation support', 'Testing and sign-off included'],
  },
  {
    icon: <HeadphonesIcon size={28} className="text-primary" />,
    title: 'Support',
    description: 'Product guidance, warranty coordination and ongoing business support. Our team helps you get the most from your technology investment over its full lifetime.',
    bullets: ['Warranty claim coordination', 'Product configuration advice', 'Replacement sourcing'],
  },
  {
    icon: <FileText size={28} className="text-primary" />,
    title: 'Quotations',
    description: 'Configuration-led RFQ workflow for business purchases. We prepare detailed quotations with confirmed availability, specifications and pricing.',
    bullets: ['No upfront commitment required', 'Detailed line-item quotations', 'Multi-currency support (GBP, USD, EUR)'],
  },
];

const DIFFERENTIATORS = [
  { icon: <CheckCircle size={20} className="text-primary" />, title: 'Genuine Products Only', desc: 'Every item is sourced through authorised distribution channels with full manufacturer warranty.' },
  { icon: <Clock size={20} className="text-primary" />, title: 'Confirmed Before Commitment', desc: 'Price, availability and configuration are verified before any purchase order is raised.' },
  { icon: <Users size={20} className="text-primary" />, title: 'Business-First Approach', desc: 'Our workflow is designed for procurement teams, not individual consumers.' },
];

const ServicesPage: React.FC = () => (
  <PageLayout>
    <PageMeta
      title="IT Services — C-Hear Technologies Supply & Support"
      description="C-Hear Technologies offers IT supply, networking, security, deployment, support and quotation services for businesses in Kenya, UK and USA."
      keywords="IT services, technology supply, networking, security, IT support, business deployment"
    />

    {/* Hero */}
    <section className="bg-brand-black text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.3) 20px,rgba(255,255,255,.3) 21px)' }} />
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 relative">
        <p className="eyebrow-label mb-3">OUR SERVICES</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl leading-tight">
          Technology Supply<br />and Expert Support
        </h1>
        <p className="text-white/60 max-w-2xl text-base leading-relaxed mb-8">
          Business-focused sourcing and support across the full technology lifecycle — from initial specification to long-term warranty coordination.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/quote" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors text-sm">
            Request a Quote <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-bold px-6 py-3 rounded hover:border-white/60 transition-colors text-sm">
            Contact Us
          </Link>
        </div>
      </div>
    </section>

    {/* Differentiators */}
    <section className="bg-white border-b border-border">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {DIFFERENTIATORS.map(d => (
            <div key={d.title} className="flex items-start gap-4 py-6 px-6">
              <div className="shrink-0 mt-0.5">{d.icon}</div>
              <div>
                <p className="font-extrabold text-sm mb-1">{d.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Services grid */}
    <section className="py-16 bg-muted/30">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="text-center mb-12">
          <p className="eyebrow-label mb-2">WHAT WE OFFER</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Six Core Service Areas</h2>
          <span className="red-accent-line mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(s => (
            <div key={s.title} className="bg-white border border-border rounded-xl p-6 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              <div className="w-12 h-12 bg-brand-red-soft rounded-lg flex items-center justify-center mb-4 shrink-0">
                {s.icon}
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{s.description}</p>
              <ul className="flex flex-col gap-1.5">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle size={12} className="text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How we work */}
    <section className="py-16 bg-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="text-center mb-12">
          <p className="eyebrow-label mb-2">HOW WE WORK</p>
          <h2 className="text-3xl font-extrabold tracking-tight">From Requirement to Fulfilment</h2>
          <span className="red-accent-line mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
          {[
            { step: '01', title: 'Enquiry', desc: 'Share your requirements via our quote request form or direct contact.', icon: '📋' },
            { step: '02', title: 'Specification', desc: 'We confirm the right product model, configuration and availability.', icon: '⚙️' },
            { step: '03', title: 'Quotation', desc: 'We send a detailed quotation with pricing, warranty and delivery terms.', icon: '📄' },
            { step: '04', title: 'Fulfilment', desc: 'Order confirmed, goods sourced and delivered to your business.', icon: '🚚' },
          ].map((step, i) => (
            <div key={step.step} className="flex flex-col items-center text-center px-4 mb-8 md:mb-0 relative">
              <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl mb-4 bg-white z-10 transition-all ${i === 0 ? 'border-primary shadow-sm' : 'border-border'}`}>
                {step.icon}
              </div>
              <p className="text-xs font-extrabold text-primary uppercase tracking-widest mb-1">{step.step}</p>
              <h3 className="font-extrabold text-base mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[180px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-brand-black text-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 text-center">
        <p className="eyebrow-label mb-3">GET STARTED TODAY</p>
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">Ready to discuss your requirements?</h2>
        <p className="text-white/60 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
          Tell us what your business needs and we will prepare a detailed quotation — no upfront commitment required.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/quote" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded hover:bg-primary/90 transition-colors">
            Request a Quote
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-bold px-8 py-3.5 rounded hover:border-white/60 hover:bg-white/5 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default ServicesPage;
