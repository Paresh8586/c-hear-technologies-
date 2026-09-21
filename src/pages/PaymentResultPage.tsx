import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageMeta from '@/components/common/PageMeta';

const PaymentResultPage: React.FC = () => {
  const { status } = useParams<{ status: 'success' | 'failed' }>();
  const successful = status === 'success';

  return (
    <PageLayout>
      <PageMeta
        title={successful ? 'Payment received | C-Hear' : 'Payment not completed | C-Hear'}
        description="Stripe payment result"
      />
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {successful
            ? <CheckCircle2 size={64} className="text-green-600 mx-auto mb-6" />
            : <XCircle size={64} className="text-primary mx-auto mb-6" />}
          <h1 className="text-3xl font-extrabold mb-4">
            {successful ? 'Payment received' : 'Payment was not completed'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {successful
              ? 'Stripe has returned you to C-Hear. Your order remains subject to confirmation after we receive the payment notification.'
              : 'No payment has been confirmed. You can return to checkout or contact sales for assistance.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {!successful && (
              <Link to="/checkout?mode=buy" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded">
                Return to checkout
              </Link>
            )}
            <Link to="/products" className="border border-border font-bold px-6 py-3 rounded">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PaymentResultPage;
