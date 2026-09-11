import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminGuard from '@/components/common/AdminGuard';
import AdminLoginPage from '@/pages/AdminLoginPage';
import { routes } from './routes';

const ADMIN_PATHS = ['/admin/stock', '/admin/quote', '/admin/invoice'];

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <IntersectObserver />
          <Routes>
            {/* Staff login — public */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected admin routes */}
            {routes
              .filter(r => ADMIN_PATHS.includes(r.path))
              .map((route, index) => (
                <Route
                  key={`admin-${index}`}
                  path={route.path}
                  element={<AdminGuard>{route.element}</AdminGuard>}
                />
              ))}

            {/* All other public routes */}
            {routes
              .filter(r => !ADMIN_PATHS.includes(r.path))
              .map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
