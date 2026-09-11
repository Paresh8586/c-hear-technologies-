import React, { useState } from 'react';
import { Phone, Mail, Globe, Clock, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

const CONTACT_DETAILS = [
  { icon: <Phone size={18} className="text-primary" />, label: 'Phone', value: '0203 807 8262', href: 'tel:+442038078262' },
  { icon: <Mail size={18} className="text-primary" />, label: 'General Enquiries', value: 'info@c-hear.co.uk', href: 'mailto:info@c-hear.co.uk' },
  { icon: <Mail size={18} className="text-primary" />, label: 'Sales', value: 'sales@c-hear.co.uk', href: 'mailto:sales@c-hear.co.uk' },
  { icon: <Globe size={18} className="text-primary" />, label: 'Website', value: 'www.c-hear.co.uk', href: 'https://www.c-hear.co.uk' },
];

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Website Enquiry – C Hear Technologies');
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company || '—'}\nEmail: ${form.email}\nPhone: ${form.phone || '—'}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info@c-hear.co.uk?subject=${subject}&body=${body}`;
    toast.success('Your email client is opening with your enquiry pre-filled.');
    setForm({ name: '', company: '', email: '', phone: '', message: '' });
  };

  return (
    <PageLayout>
      <PageMeta
        title="Contact C-Hear Technologies — Get in Touch"
        description="Contact C-Hear Technologies for IT hardware and software enquiries. Phone 0203 807 8262, email info@c-hear.co.uk or use our online enquiry form."
        keywords="contact C-Hear, IT enquiry, technology supplier contact, get a quote, sales enquiry"
      />

      {/* Hero */}
      <section className="bg-brand-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.3) 20px,rgba(255,255,255,.3) 21px)' }} />
        <div className="max-w-[1480px] mx-auto px-4 md:px-9 relative">
          <p className="eyebrow-label mb-3">CONTACT C HEAR</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-2xl leading-tight">
            Let's discuss your technology requirements.
          </h1>
          <p className="text-white/60 max-w-xl text-base leading-relaxed">
            Use the quotation workflow for product requirements, or contact us directly using the details below.
          </p>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-primary text-white">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <a href="tel:+442038078262" className="flex items-center gap-4 py-5 px-6 hover:bg-primary/80 transition-colors group">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Phone size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Call us directly</p>
                <p className="font-extrabold text-lg group-hover:underline">0203 807 8262</p>
              </div>
            </a>
            <a href="mailto:sales@c-hear.co.uk" className="flex items-center gap-4 py-5 px-6 hover:bg-primary/80 transition-colors group">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Mail size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">Email our sales team</p>
                <p className="font-extrabold text-lg group-hover:underline">sales@c-hear.co.uk</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            {/* Left: contact info + hours */}
            <div className="md:col-span-2 flex flex-col gap-5">
              <div>
                <p className="eyebrow-label mb-4">CONTACT DETAILS</p>
                <div className="flex flex-col gap-3">
                  {CONTACT_DETAILS.map(c => (
                    <div key={c.label} className="bg-white border border-border rounded-xl p-4 flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 w-8 h-8 bg-brand-red-soft rounded-lg flex items-center justify-center">{c.icon}</div>
                      <div>
                        <p className="font-bold text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
                        {c.href ? (
                          <a href={c.href} className="text-sm font-semibold hover:text-primary transition-colors">{c.value}</a>
                        ) : (
                          <p className="text-sm font-semibold">{c.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-primary" />
                  <p className="font-extrabold text-sm">Business Hours</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Monday – Friday</span>
                    <span className="font-semibold">9:00 – 18:00 GMT</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-semibold">10:00 – 14:00 GMT</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-semibold text-muted-foreground">Closed</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-primary" />
                  <p className="font-extrabold text-sm">Location</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  C Hear Technologies Limited<br />
                  United Kingdom<br />
                  <a href="https://www.c-hear.co.uk" className="text-primary hover:underline font-medium">www.c-hear.co.uk</a>
                </p>
              </div>
            </div>

            {/* Right: enquiry form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 bg-white border border-border rounded-xl p-8 flex flex-col gap-4 shadow-sm">
              <div>
                <p className="eyebrow-label mb-1">SEND US A MESSAGE</p>
                <h2 className="font-extrabold text-2xl mb-1">Send an Enquiry</h2>
                <p className="text-sm text-muted-foreground">We typically respond within one business day.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name *" className="border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company" className="border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email *" className="border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <textarea required rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help? *" className="border border-border rounded-lg px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary" />
              <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                Send Enquiry <ArrowRight size={16} />
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Your message will open in your default email client — no data is stored on our servers.
              </p>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
