import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from './types';
import { PRODUCTS } from './data';
import { fetchPublicProducts } from './lib/catalog';

interface CatalogContextValue {
  products: Product[];
  source: 'supabase' | 'seed';
  loading: boolean;
  refresh: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [source, setSource] = useState<'supabase' | 'seed'>('seed');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await fetchPublicProducts();
      setProducts(result.products);
      setSource(result.source);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <CatalogContext.Provider value={{ products, source, loading, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
