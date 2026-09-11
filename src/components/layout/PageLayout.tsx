import React from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
    <TopBar />
    <Header />
    <main className="flex-1 min-w-0 w-full overflow-x-hidden">
      {children}
    </main>
    <Footer />
    <CartDrawer />
  </div>
);

export default PageLayout;
