import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';
import { useCart } from '@/contexts/CartContext';

const QuotePage: React.FC = () => {
  const { quoteCart, products, clearCart, quoteItems } = useCart();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });

  const getProduct = (sku: string) => products.find(p => p.sku === sku);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cartLines = quoteCart.map(item => {
      const product = getProduct(item.sku);
      return `  - ${product?.name ?? item.sku} (SKU: ${item.sku}) × ${item.qty}`;
    }).join('\n');
    const subject = encodeURIComponent('Quote Request – C Hear Technologies');
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company || '—'}\nEmail: ${form.email}\nPhone: ${form.phone || '—'}\n\nProducts Requested:\n${cartLines || '  (no products listed)'}\n\nAdditional Requirements:\n${form.message}`
    );
    window.location.href = `mailto:info@c-hear.co.uk?subject=${subject}&body=${body}`;
    toast.success('Your email client is opening with your quote request pre-filled.');
    setForm({ name: '', company: '', email: '', phone: '', message: '' });
    clearCart('quote');
  };

  return (
    <PageLayout>
      <PageMeta
        title="Request a Quote — C-Hear Technologies IT Products"
        description="Submit a quote request for IT hardware and software. C-Hear Technologies will prepare a full configuration and pricing for your business requirements."
        keywords="request a quote, IT quote, hardware quotation, business technology pricing, RFQ"
      />
      {/* Hero */}
      <section className="bg-brand-black text-white py-12">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <p className="eyebrow-label mb-2">BUSINESS QUOTATION</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Request a Quote</h1>
          <p className="text-white/60 max-w-2xl text-sm">
            Provide your details and requirements. We will prepare a configuration and quotation for you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-red-soft">
        <div className="max-w-[1480px] mx-auto px-4 md:px-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Enquiry summary */}
            <div>
              <p className="eyebrow-label mb-4">YOUR QUOTE ENQUIRY</p>

              {quoteItems > 0 ? (
                <div className="bg-white border border-border rounded mb-6">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                    <ShoppingBag size={16} className="text-primary" />
                    <span className="font-bold text-sm">{quoteItems} item{quoteItems !== 1 ? 's' : ''} in your quote enquiry</span>
                  </div>
                  <div className="divide-y divide-border">
                    {quoteCart.map(item => {
                      const product = getProduct(item.sku);
                      return (
                        <div key={item.sku} className="px-4 py-3 flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{product?.name ?? item.sku}</p>
                            <p className="text-xs text-muted-foreground">{product?.brand ?? ''} · SKU: {item.sku}</p>
                          </div>
                          <span className="text-xs font-bold shrink-0 bg-muted px-2 py-1 rounded">Qty: {item.qty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-border rounded p-6 mb-6 text-center">
                  <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No products have been added to your quote enquiry yet.</p>
                  <Link to="/products" className="text-primary text-sm font-bold hover:underline">
                    Browse Products →
                  </Link>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded">
                <p className="font-bold mb-1">Quote-based catalogue</p>
                <p>
                  Final configuration, availability, price and applicable tax are confirmed before fulfilment.
                  No payment is taken at this stage.
                </p>
              </div>

              <div className="mt-6 bg-white border border-border rounded p-5">
                <h3 className="font-bold text-sm mb-3">Need to add more products?</h3>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
                >
                  Back to Products <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Quote form */}
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded p-6 flex flex-col gap-3">
              <h2 className="font-extrabold text-xl mb-1">Your Details</h2>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full name *"
                className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <input
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="Company name"
                className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Business email *"
                className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Telephone"
                className="border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Products, quantities, configurations, delivery location or other requirements *"
                className="border border-border rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded hover:bg-primary/90 transition-colors">
                Prepare Quote Request →
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default QuotePage;
