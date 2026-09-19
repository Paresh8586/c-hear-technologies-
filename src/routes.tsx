import type { ReactNode } from 'react';
import HomePage from './pages/HomePage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductListPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SolutionsPage from './pages/SolutionsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import CheckoutPage from './pages/CheckoutPage';
import StockImportPage from './pages/StockImportPage';
import QuoteBuilderPage from './pages/QuoteBuilderPage';
import InvoiceBuilderPage from './pages/InvoiceBuilderPage';
import InvoiceViewPage from './pages/InvoiceViewPage';
import TermsPage from './pages/TermsPage';
import PaymentResultPage from './pages/PaymentResultPage';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home',            path: '/',                element: <HomePage />,           public: true },
  // Products: /products → category browser, /products/list → filtered grid
  { name: 'Products',        path: '/products',        element: <ProductCatalogPage />, public: true },
  { name: 'Product List',    path: '/products/list',   element: <ProductListPage />,    public: true },
  { name: 'Product Detail',  path: '/product',         element: <ProductDetailPage />,  public: true },
  { name: 'Solutions',       path: '/solutions',       element: <SolutionsPage />,      public: true },
  { name: 'Services',        path: '/services',        element: <ServicesPage />,       public: true },
  { name: 'About Us',        path: '/about',           element: <AboutPage />,          public: true },
  { name: 'Contact Us',      path: '/contact',         element: <ContactPage />,        public: true },
  { name: 'Quote',           path: '/quote',           element: <QuotePage />,          public: true },
  { name: 'Checkout',        path: '/checkout',        element: <CheckoutPage />,       public: true },
  { name: 'Invoice View',    path: '/invoice',         element: <InvoiceViewPage />,    public: true },
  { name: 'Terms',           path: '/terms',           element: <TermsPage />,          public: true },
  { name: 'Payment Result',  path: '/payment/:status', element: <PaymentResultPage />,  public: true },
  // Staff / admin tools
  { name: 'Stock Import',    path: '/admin/stock',     element: <StockImportPage />,    public: true },
  { name: 'Quote Builder',   path: '/admin/quote',     element: <QuoteBuilderPage />,   public: true },
  { name: 'Invoice Builder', path: '/admin/invoice',   element: <InvoiceBuilderPage />, public: true },
];
