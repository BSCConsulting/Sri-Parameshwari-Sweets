import { PRODUCTS } from '../data';
import type { Product, Weight, Category } from '../types';
import { supabase } from './supabase';

export type ProductRow = {
  id: string;
  name: string;
  telugu_name: string;
  category: string;
  description: string;
  image: string;
  price_250g: number;
  price_500g: number;
  price_1kg: number;
  tags: string[] | null;
  active: boolean;
  sort_order: number;
};

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    teluguName: row.telugu_name,
    category: row.category as Exclude<Category, 'all'>,
    description: row.description,
    image: row.image,
    prices: {
      '250g': row.price_250g,
      '500g': row.price_500g,
      '1kg': row.price_1kg,
    },
    tags: row.tags ?? [],
  };
}

export function productToRow(p: Product, sortOrder = 0, active = true): Omit<ProductRow, 'sort_order' | 'active'> & {
  sort_order: number;
  active: boolean;
} {
  return {
    id: p.id,
    name: p.name,
    telugu_name: p.teluguName,
    category: p.category,
    description: p.description,
    image: p.image,
    price_250g: p.prices['250g'],
    price_500g: p.prices['500g'],
    price_1kg: p.prices['1kg'],
    tags: p.tags,
    active,
    sort_order: sortOrder,
  };
}

/** Public catalog: active rows from Supabase, or seed catalog if offline / empty. */
export async function fetchPublicProducts(): Promise<{ products: Product[]; source: 'supabase' | 'seed' }> {
  if (!supabase) return { products: PRODUCTS, source: 'seed' };
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return { products: PRODUCTS, source: 'seed' };
  return { products: (data as ProductRow[]).map(rowToProduct), source: 'supabase' };
}

/** Admin: every row including inactive. */
export async function fetchAllProductRows(): Promise<ProductRow[]> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProductRow[];
}

export async function upsertProduct(row: ProductRow): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('products').upsert({
    ...row,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function seedCatalogFromCode(): Promise<number> {
  if (!supabase) throw new Error('Supabase is not configured');
  const rows = PRODUCTS.map((p, i) => productToRow(p, i + 1, true));
  const { error } = await supabase.from('products').upsert(rows);
  if (error) throw error;
  return rows.length;
}

export async function uploadProductImage(productId: string, file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${Date.now()}.${ext}`;
  // Bucket name matches Supabase Storage UI (`project-images`, public).
  const { error } = await supabase.storage.from('project-images').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('project-images').getPublicUrl(path);
  return data.publicUrl;
}

export function slugifyId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || `item-${Date.now()}`;
}

export const WEIGHTS: Weight[] = ['250g', '500g', '1kg'];

export const PRODUCT_CATEGORIES: Exclude<Category, 'all'>[] = [
  'ghee-specials',
  'andhra-sweets',
  'kaju-dryfruit',
  'savory-mixtures',
  'festival-giftboxes',
];
