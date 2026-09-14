import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

/* ─── Section data ─────────────────────────────────────────────────────────── */
interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: 'interpretation',
    title: '1. Interpretation & Definitions',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>In these Terms and Conditions the following definitions apply:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><strong className="text-foreground">"Company"</strong> means C Hear Technologies Limited, a company registered in England and Wales.</li>
          <li><strong className="text-foreground">"Customer"</strong> means any business entity or individual placing an order with the Company.</li>
          <li><strong className="text-foreground">"Goods"</strong> means any hardware, software, licensing or related products supplied by the Company.</li>
          <li><strong className="text-foreground">"Order"</strong> means a confirmed purchase order or accepted quotation.</li>
          <li><strong className="text-foreground">"Website"</strong> means www.c-hear.online and all sub-pages thereof.</li>
          <li><strong className="text-foreground">"Working Day"</strong> means Monday to Friday, excluding UK public holidays.</li>
        </ul>
        <p>These Terms apply to all transactions conducted through the Website or by quotation, and supersede any prior agreements unless expressly agreed in writing by a director of the Company.</p>
      </div>
    ),
  },
  {
    id: 'formation',
    title: '2. Contract Formation & Quotations',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>All quotations issued by the Company are subject to stock availability and are valid for <strong className="text-foreground">30 days</strong> from the date of issue unless otherwise stated. A legally binding contract is formed only when:</p>
        <ol className="list-decimal pl-5 flex flex-col gap-1.5">
          <li>The Customer places a written order (email, web form or purchase order) referencing an accepted quotation; and</li>
          <li>The Company issues a written order confirmation; and</li>
          <li>Payment is received or an approved credit arrangement is in place.</li>
        </ol>
        <p>The Company reserves the right to decline any order at its sole discretion, including where goods are no longer available, pricing errors have occurred, or the Customer fails our verification checks. Any advertisements or price lists published on the Website constitute an invitation to treat, not an offer.</p>
        <p>Where goods are sold under manufacturer or distributor licence terms, those licence terms form part of the contract and the Customer agrees to be bound by them.</p>
      </div>
    ),
  },
  {
    id: 'pricing',
    title: '3. Pricing, VAT & Currency',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>All prices displayed on the Website are indicative and <strong className="text-foreground">exclusive of VAT</strong> unless stated otherwise. Final confirmed pricing is provided in a formal quotation.</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><strong className="text-foreground">United Kingdom:</strong> VAT at the current standard rate (20%) will be added to all invoices where applicable.</li>
          <li><strong className="text-foreground">European Union:</strong> VAT may apply depending on the Customer's VAT registration status and applicable reverse-charge rules.</li>
          <li><strong className="text-foreground">USA & Other Territories:</strong> Prices are quoted exclusive of any local sales tax, duties or import charges, which remain the Customer's responsibility.</li>
        </ul>
        <p>The Company operates a <strong className="text-foreground">multi-currency display</strong> (GBP, USD, EUR) for indicative purposes only. All invoices are settled in <strong className="text-foreground">GBP (£ Sterling)</strong> unless a specific written agreement states otherwise. Currency conversion rates shown on the Website are updated periodically and may not reflect live exchange rates.</p>
        <p>The Company reserves the right to correct pricing errors at any time before an order is fulfilled. In such cases, the Customer will be notified and given the option to proceed at the corrected price or cancel without penalty.</p>
      </div>
    ),
  },
  {
    id: 'payment',
    title: '4. Payment Terms',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>Payment is due in full prior to dispatch unless the Customer holds an approved credit account. The Company accepts payment by:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Credit or debit card via the Company's selected secure payment provider.</li>
          <li>Bank transfer (BACS / CHAPS) — details provided on invoice.</li>
          <li>Other methods as agreed in writing.</li>
        </ul>
        <p>Card payments are processed by the Company's selected payment provider. The Company does not store, transmit or process card data directly. Card transactions are subject to the provider's own terms of service and privacy policy.</p>
        <p>For credit account holders, payment terms are <strong className="text-foreground">net 30 days</strong> from invoice date unless stated otherwise. Late payments will incur statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998 at 8% above the Bank of England base rate, plus compensation charges as set out in that Act.</p>
      </div>
    ),
  },
  {
    id: 'delivery',
    title: '5. Delivery Conditions',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p><strong className="text-foreground">5.1 Delivery Estimates.</strong> Any delivery timescales provided are estimates only and do not constitute a contractual commitment. Delivery times are subject to stock availability, carrier capacity and circumstances outside the Company's control.</p>
        <p><strong className="text-foreground">5.2 Delivery Charges.</strong> Delivery charges are calculated by order weight and destination country as follows:</p>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border border-border rounded mt-1">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 font-bold text-foreground">Weight Band</th>
                <th className="text-left px-3 py-2 font-bold text-foreground">UK (ex-VAT)</th>
                <th className="text-left px-3 py-2 font-bold text-foreground">Europe</th>
                <th className="text-left px-3 py-2 font-bold text-foreground">Rest of World</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['0 – 1 kg',   '£5.99',  '£19.99', '£39.99'],
                ['1 – 5 kg',   '£9.99',  '£29.99', '£59.99'],
                ['5 – 15 kg',  '£14.99', '£49.99', '£89.99'],
                ['15 – 30 kg', '£24.99', '£79.99', '£149.99'],
                ['30 kg+',     'POA',    'POA',    'POA'],
              ].map(([band, uk, eu, row]) => (
                <tr key={band} className="even:bg-muted/30">
                  <td className="px-3 py-2">{band}</td>
                  <td className="px-3 py-2">{uk}</td>
                  <td className="px-3 py-2">{eu}</td>
                  <td className="px-3 py-2">{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs">POA = Price on Application. All delivery charges are estimates; final charges are confirmed on quotation.</p>
        <p><strong className="text-foreground">5.3 Risk & Title.</strong> Risk in the goods passes to the Customer upon delivery. Title to the goods remains with the Company until payment is received in full.</p>
        <p><strong className="text-foreground">5.4 International Deliveries.</strong> For deliveries outside the United Kingdom, the Customer is responsible for all import duties, customs clearance fees, local taxes and any other charges levied by the destination country. The Company will not be held liable for delays caused by customs procedures.</p>
        <p><strong className="text-foreground">5.5 Delivery Failures.</strong> If a delivery attempt fails due to the Customer's absence or incorrect address information provided, any re-delivery charges will be the Customer's responsibility. The Company is not liable for losses arising from carrier delays, lost parcels or force majeure events.</p>
        <p><strong className="text-foreground">5.6 Inspection on Receipt.</strong> The Customer must inspect goods upon delivery and notify the Company of any visible damage, shortage or discrepancy within <strong className="text-foreground">48 hours</strong> of receipt. Failure to do so may affect the Customer's right to make a claim.</p>
      </div>
    ),
  },
  {
    id: 'returns',
    title: '6. Returns, Cancellations & Refunds',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p><strong className="text-foreground">6.1 Business Customers (B2B).</strong> As a business-to-business supplier, the Company sells primarily to trade customers. Consumer statutory rights (including 14-day cooling-off rights under the Consumer Contracts Regulations 2013) do not apply to B2B transactions unless agreed in writing.</p>
        <p><strong className="text-foreground">6.2 Faulty or Damaged Goods.</strong> If goods are found to be defective or damaged in transit, the Customer must notify the Company within 48 hours of receipt. The Company will arrange, at its discretion, a repair, replacement or refund.</p>
        <p><strong className="text-foreground">6.3 Manufacturer Warranty.</strong> All goods are supplied with the relevant manufacturer warranty. Warranty claims must be directed in the first instance to the Company, who will liaise with the manufacturer or distributor.</p>
        <p><strong className="text-foreground">6.4 Software & Licensing.</strong> Opened software, activated licence keys or downloaded digital products cannot be returned or refunded unless they are defective.</p>
        <p><strong className="text-foreground">6.5 Order Cancellations.</strong> Orders may not be cancelled once dispatched. For goods that have not yet been dispatched, cancellations must be requested in writing and are subject to the Company's acceptance and any restocking fees imposed by the supplier.</p>
        <p><strong className="text-foreground">6.6 Refunds.</strong> Approved refunds will be processed to the original payment method within 10 Working Days of the Company confirming the return. Refund processing times may vary depending on the payment provider.</p>
      </div>
    ),
  },
  {
    id: 'liability',
    title: '7. Liability & Indemnity',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>Nothing in these Terms limits the Company's liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law.</p>
        <p>Subject to the above, the Company's total liability to the Customer, whether in contract, tort (including negligence) or otherwise, shall not exceed the total amount paid by the Customer for the goods giving rise to the claim in the 12 months preceding the claim.</p>
        <p>The Company shall not be liable for:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Loss of profit, revenue, business or anticipated savings;</li>
          <li>Loss of data or software;</li>
          <li>Indirect or consequential losses;</li>
          <li>Any loss arising from the Customer's use of, or inability to use, third-party software or services.</li>
        </ul>
        <p>The Customer shall indemnify the Company against all claims, liabilities, costs and expenses arising from the Customer's breach of these Terms or misuse of the goods.</p>
      </div>
    ),
  },
  {
    id: 'ip',
    title: '8. Intellectual Property',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>All intellectual property rights in the goods, including software, remain with the respective manufacturer or licensor. The Customer receives only the rights expressly granted by the relevant end-user licence agreement (EULA).</p>
        <p>All content on the Website, including text, images, trademarks and design, is the property of C Hear Technologies Limited or its licensors and may not be reproduced without prior written consent.</p>
      </div>
    ),
  },
  {
    id: 'data',
    title: '9. Data Protection & Privacy',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>The Company processes personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Personal data provided in connection with an order will be used for order processing, delivery and customer communications.</p>
        <p>Payment card data is processed exclusively by the Company's selected payment provider and is subject to that provider's privacy policy. The Company does not store card numbers or CVV/CVC codes.</p>
        <p>The Company will not sell or share personal data with third parties except as required for order fulfilment (e.g. carriers), payment processing or as required by law.</p>
      </div>
    ),
  },
  {
    id: 'general',
    title: '10. General Provisions',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Force Majeure.</strong> The Company shall not be in breach of these Terms nor liable for delay or failure to perform its obligations where such delay or failure results from events beyond its reasonable control, including but not limited to natural disasters, pandemics, acts of government, carrier strikes, component shortages or telecommunications failures.</p>
        <p><strong className="text-foreground">Entire Agreement.</strong> These Terms, together with any accepted quotation, constitute the entire agreement between the parties and supersede all prior communications.</p>
        <p><strong className="text-foreground">Severability.</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force.</p>
        <p><strong className="text-foreground">Waiver.</strong> No failure or delay by the Company in exercising any right shall constitute a waiver of that right.</p>
        <p><strong className="text-foreground">Governing Law.</strong> These Terms are governed by the laws of <strong>England and Wales</strong>. Any dispute shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        <p><strong className="text-foreground">Amendments.</strong> The Company reserves the right to amend these Terms at any time. The version published on the Website at the time of your order shall apply to that order.</p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '11. Contact',
    content: (
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <p>For any queries relating to these Terms and Conditions please contact:</p>
        <address className="not-italic flex flex-col gap-1">
          <strong className="text-foreground">C Hear Technologies Limited</strong>
          <span>Email: <a href="mailto:info@c-hear.online" className="text-primary hover:underline">info@c-hear.online</a></span>
          <span>Sales: <a href="mailto:sales@c-hear.online" className="text-primary hover:underline">sales@c-hear.online</a></span>
          <span>Telephone: <a href="tel:+442038078262" className="text-primary hover:underline">0203 807 8262</a></span>
          <span>Website: <a href="https://www.c-hear.online" className="text-primary hover:underline">www.c-hear.online</a></span>
        </address>
      </div>
    ),
  },
];

/* ─── Accordion item ────────────────────────────────────────────────────────── */
const AccordionItem: React.FC<{ section: Section; defaultOpen?: boolean }> = ({ section, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-card hover:bg-muted/50 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="font-bold text-sm text-foreground">{section.title}</span>
        {open
          ? <ChevronUp size={16} className="shrink-0 text-primary" />
          : <ChevronDown size={16} className="shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-6 py-5 border-t border-border bg-background">
          {section.content}
        </div>
      )}
    </div>
  );
};

/* ─── Page ──────────────────────────────────────────────────────────────────── */
const TermsPage: React.FC = () => (
  <PageLayout>
    <PageMeta
      title="Terms & Conditions — C-Hear Technologies"
      description="Terms and conditions for C-Hear Technologies Limited, covering product supply, pricing, VAT, delivery, returns, payment, and governing law."
      keywords="terms and conditions, delivery policy, returns policy, payment terms, IT supplier terms"
    />

    {/* Hero */}
    <section className="bg-brand-black text-white py-12">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <p className="eyebrow-label mb-2">LEGAL</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms & Conditions</h1>
        <p className="text-white/60 max-w-2xl text-sm">
          Please read these terms carefully before placing an order with C Hear Technologies Limited.
          By placing an order you agree to be bound by these terms.
        </p>
        <p className="text-white/40 text-xs mt-4">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </section>

    {/* Summary banner */}
    <section className="bg-brand-red-soft border-b border-border py-6">
      <div className="max-w-[1480px] mx-auto px-4 md:px-9">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            { label: 'Governing Law', value: 'England & Wales' },
            { label: 'Payment Provider', value: 'Selected merchant provider' },
            { label: 'Invoice Currency', value: 'GBP (£ Sterling)' },
          ].map(item => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">{item.label}</span>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Accordion sections */}
    <section className="py-14 bg-muted/20">
      <div className="max-w-[860px] mx-auto px-4 md:px-9 flex flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <AccordionItem key={s.id} section={s} defaultOpen={i === 0} />
        ))}
      </div>
    </section>

    {/* Footer note */}
    <section className="py-8 bg-white border-t border-border">
      <div className="max-w-[860px] mx-auto px-4 md:px-9 text-center text-xs text-muted-foreground">
        <p>
          These Terms & Conditions were last reviewed on{' '}
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
          For the most current version please visit <a href="https://www.c-hear.online/terms" className="text-primary hover:underline">www.c-hear.online/terms</a>.
          This document does not constitute legal advice. If you require legal advice please consult a qualified solicitor.
        </p>
      </div>
    </section>
  </PageLayout>
);

export default TermsPage;
