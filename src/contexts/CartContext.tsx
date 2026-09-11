import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '@/types/product';

export type CartMode = 'quote' | 'buy';

export interface CartItemWithMode extends CartItem {
  mode: CartMode;
}

interface CartContextValue {
  // Full unified cart (all items regardless of mode)
  cart: CartItemWithMode[];
  // Convenience filtered views
  quoteCart: CartItemWithMode[];
  buyCart: CartItemWithMode[];
  products: Product[];
  // Add with explicit mode
  addToCart: (sku: string, mode: CartMode) => void;
  removeFromCart: (sku: string, mode: CartMode) => void;
  changeQty: (sku: string, mode: CartMode, delta: number) => void;
  clearCart: (mode?: CartMode) => void;
  updateProducts: (updated: Product[]) => void;
  // Counts
  totalItems: number;
  quoteItems: number;
  buyItems: number;
  // Drawer state — tracks which tab was last opened
  isOpen: boolean;
  activeTab: CartMode;
  openCart: (tab?: CartMode) => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY     = 'chearCart_v2';
const OLD_CART_KEY = 'chearCart'; // legacy key — must be purged on load

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItemWithMode[]>(() => {
    try {
      // Purge the legacy key so old modeless items never bleed through
      localStorage.removeItem(OLD_CART_KEY);

      const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItemWithMode[];
      // Only keep items that have an explicit, valid mode — discard anything ambiguous
      return stored.filter(i => i.mode === 'quote' || i.mode === 'buy');
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CartMode>('quote');

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then((data: Product[] | { products: Product[] }) => {
        setProducts(Array.isArray(data) ? data : (data as { products: Product[] }).products ?? []);
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = useCallback((sku: string, mode: CartMode) => {
    setCart(prev => {
      const existing = prev.find(i => i.sku === sku && i.mode === mode);
      if (existing) return prev.map(i =>
        i.sku === sku && i.mode === mode ? { ...i, qty: i.qty + 1 } : i
      );
      return [...prev, { sku, qty: 1, mode }];
    });
  }, []);

  const removeFromCart = useCallback((sku: string, mode: CartMode) => {
    setCart(prev => prev.filter(i => !(i.sku === sku && i.mode === mode)));
  }, []);

  const changeQty = useCallback((sku: string, mode: CartMode, delta: number) => {
    setCart(prev => {
      const updated = prev.map(i =>
        i.sku === sku && i.mode === mode ? { ...i, qty: i.qty + delta } : i
      );
      return updated.filter(i => i.qty > 0);
    });
  }, []);

  const clearCart = useCallback((mode?: CartMode) => {
    setCart(prev => mode ? prev.filter(i => i.mode !== mode) : []);
  }, []);

  const updateProducts = useCallback((updated: Product[]) => setProducts(updated), []);

  const quoteCart = cart.filter(i => i.mode === 'quote');
  const buyCart   = cart.filter(i => i.mode === 'buy');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const quoteItems = quoteCart.reduce((s, i) => s + i.qty, 0);
  const buyItems   = buyCart.reduce((s, i) => s + i.qty, 0);

  const openCart = useCallback((tab?: CartMode) => {
    // Set the tab first (synchronously before opening) so the
    // drawer never flickers with the wrong tab visible.
    setActiveTab(prev => tab ?? prev);
    setIsOpen(true);
  }, []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider value={{
      cart, quoteCart, buyCart, products,
      addToCart, removeFromCart, changeQty, clearCart, updateProducts,
      totalItems, quoteItems, buyItems,
      isOpen, activeTab, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
