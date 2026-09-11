import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Network, Lock, Code2, Video, Zap, Tablet, Phone, Cloud, Headphones, ArrowRight, CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

const SOLUTIONS = [
  {
    icon: <Monitor size={28} className="text-primary" />,
    title: 'Business Computing',
    description: 'Business laptops, desktops, workstations, monitors and accessories for every role and budget. From entry-level office machines to high-performance engineering workstations.',
    category: 'Laptops & Computers',
    bullets: ['HP, Dell, Lenovo, Apple', 'Windows 11 Pro imaging', 'Laptop to desktop and everything between'],
    tag: 'Hardware',
  },
  {
    icon: <Network size={28} className="text-primary" />,
    title: 'Network Infrastructure',
    description: 'Switches, Wi-Fi access points, firewalls, cabling and network cabinets. Build robust, scalable connectivity for small offices or large enterprise environments.',
    category: 'Networking',
    bullets: ['Cisco, HPE, Ubiquiti, Netgear', 'PoE and managed switching', 'Fibre and copper infrastructure'],
    tag: 'Networking',
  },
  {
    icon: <Lock size={28} className="text-primary" />,
    title: 'Security & Surveillance',
    description: 'CCTV, NVR/DVR recorders, access control and enterprise storage technology. Protect your premises and ensure business data is reliably preserved and accessible.',
    category: 'CCTV & Security',
    bullets: ['4K IP cameras and NVRs', 'Biometric and card-reader access', 'Endpoint cybersecurity software'],
    tag: 'Security',
  },
  {
    icon: <Code2 size={28} className="text-primary" />,
    title: 'Software & Licensing',
    description: 'Microsoft 365, Windows, Server, cybersecurity and productivity licensing. Volume, OEM and subscription-based options structured for business compliance.',
    category: 'Software & Licensing',
    bullets: ['Microsoft 365 Business plans', 'Windows Server CAL licensing', 'Antivirus and endpoint security'],
    tag: 'Software',
  },
  {
    icon: <Video size={28} className="text-primary" />,
    title: 'Meeting & Collaboration',
    description: 'Conference room systems, cameras, controllers, speakerphones and collaboration equipment. Enable productive hybrid and remote meetings across your business.',
    category: 'Meeting & Collaboration',
    bullets: ['Poly, Logitech, Jabra', 'Teams and Zoom certified rooms', 'Speakerphones and video bars'],
    tag: 'Collaboration',
  },
  {
    icon: <Zap size={28} className="text-primary" />,
    title: 'Power & Continuity',
    description: 'UPS systems and business power protection equipment. Keep critical infrastructure running through outages with the right capacity and runtime for your needs.',
    category: 'Power & UPS',
    bullets: ['APC, Eaton, CyberPower', 'Line-interactive and online UPS', 'Rack and tower configurations'],
    tag: 'Power',
  },
  {
    icon: <Tablet size={28} className="text-primary" />,
    title: 'Tablets & Mobile',
    description: 'Business tablets and rugged handhelds for field, retail and frontline workers. Surface Pro, iPad and Android enterprise devices with management solutions.',
    category: 'Tablets & Mobile',
    bullets: ['Microsoft Surface range', 'Apple iPad Pro and Air', 'Rugged field devices'],
    tag: 'Hardware',
  },
  {
    icon: <Phone size={28} className="text-primary" />,
    title: 'Telephony & VoIP',
    description: 'IP desk phones, DECT handsets and hosted VoIP solutions. Modernise your business communications with reliable, scalable unified communications.',
    category: 'Telephony & VoIP',
    bullets: ['Yealink, Poly, Grandstream', 'Teams and SIP compatible', 'DECT cordless systems'],
    tag: 'Comms',
  },
  {
    icon: <Cloud size={28} className="text-primary" />,
    title: 'Cloud & Managed Services',
    description: 'Microsoft Azure, Microsoft 365 and managed IT support contracts. Reduce operational overhead with expert-managed infrastructure and licenced cloud platforms.',
    category: 'Cloud Services',
    bullets: ['Azure subscription management', 'Microsoft 365 tenant setup', 'Managed support contracts'],
    tag: 'Cloud',
  },
];

const TAG_COLORS: Record<string, string> = {
  Hardware: 'bg-blue-50 text-blue-700',
  Networking: 'bg-sky-50 text-sky-700',
  Security: 'bg-red-50 text-red-700',
  Software: 'bg-purple-50 text-purple-700',
  Collaboration: 'bg-green-50 text-green-700',
  Power: 'bg-amber-50 text-amber-700',
  Comms: 'bg-teal-50 text-teal-700',
  Cloud: 'bg-indigo-50 text-indigo-700',
};

const INDUSTRIES = [
  { icon: '🏢', label: 'Corporate Offices' },
  { icon: '🏥', label: 'Healthcare' },
  { icon: '🏫', label: 'Education' },
  { icon: '🏭', label: 'Manufacturing' },
  { icon: '🛒', label: 'Retail & Hospitality' },
  { icon: '🏛️', label: 'Government & Public Sector' },
];

const SolutionsPage: React.FC = () => (
  <PageLayout>
    <PageMeta
      title="Business IT Solutions — C-Hear Technologies"
      description="Browse C-Hear business technology solutions: computing, networking, security, software licensing, collaboration and power continuity for your organisation."
      keywords="business IT solutions, network infrastructure, security solutions, software licensing, collaboration"
    />

    {/* Hero */}
    <section className="bg-brand-black text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.3) 20px,rgba(255,255,255,.3) 21px)' }} />
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 relative">
        <p className="eyebrow-label mb-3">BUSINESS SOLUTIONS</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl leading-tight">
          Technology that Supports<br />How You Work
        </h1>
        <p className="text-white/60 max-w-2xl text-base leading-relaxed mb-8">
          Build the right technology stack — from endpoint computing to connectivity, security and collaboration. We supply all the components your business needs from a single trusted partner.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors text-sm">
            Browse Products <ArrowRight size={16} />
          </Link>
          <Link to="/quote" className="inline-flex items-center gap-2 border border-white/30 text-white font-bold px-6 py-3 rounded hover:border-white/60 transition-colors text-sm">
            Request a Quote
          </Link>
        </div>
      </div>
    </section>

    {/* Solutions grid */}
    <section className="py-16 bg-muted/30">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="text-center mb-12">
          <p className="eyebrow-label mb-2">SOLUTION AREAS</p>
          <h2 className="text-3xl font-extrabold tracking-tight">9 Technology Solution Areas</h2>
          <span className="red-accent-line mx-auto mt-3" />
          <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            Each solution area maps to specific product categories and leading brands. Click to browse matching products.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map(s => (
            <div key={s.title} className="bg-white border border-border rounded-xl p-6 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-brand-red-soft rounded-lg flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full ${TAG_COLORS[s.tag] ?? 'bg-muted text-muted-foreground'}`}>
                  {s.tag}
                </span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{s.description}</p>
              <ul className="flex flex-col gap-1.5 mb-5">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle size={11} className="text-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <Link
                to={`/products/list?category=${encodeURIComponent(s.category)}`}
                className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-auto"
              >
                Browse products <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Industries */}
    <section className="py-16 bg-white border-y border-border">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="text-center mb-10">
          <p className="eyebrow-label mb-2">SECTORS WE SERVE</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Supplying Businesses Across Sectors</h2>
          <span className="red-accent-line mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INDUSTRIES.map(i => (
            <div key={i.label} className="bg-muted/50 border border-border rounded-xl p-5 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">{i.icon}</span>
              <p className="text-sm font-bold text-balance leading-tight">{i.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-brand-black text-white">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9 text-center">
        <p className="eyebrow-label mb-3">BUILD YOUR SOLUTION</p>
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">Not sure what you need?</h2>
        <p className="text-white/60 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
          Describe your business requirements and our team will recommend the right configuration and pricing for you.
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

export default SolutionsPage;
