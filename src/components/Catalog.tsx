import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data';
import type { Category } from '../types';
import ProductCard from './ProductCard';

export default function Catalog() {
  const [active, setActive] = useState<Category>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (active !== 'all') {
      list = list.filter((p) => p.category === active);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.teluguName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [active, search]);

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-gold-500 font-semibold text-sm tracking-widest uppercase mb-2">
            Heritage Catalog
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 mb-3">
            Our Signature Sweets & Savories
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto text-sm sm:text-base">
            Explore our handcrafted collection — from pure ghee laddus to traditional Andhra savories,
            each made fresh daily in Madhira.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
          <input
            type="text"
            placeholder="Search sweets, savories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-cream-300 rounded-full text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              aria-pressed={active === cat.key}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all ${
                active === cat.key
                  ? 'bg-maroon-600 text-cream-100 border-maroon-600 shadow-md'
                  : 'bg-white text-ink-700 border-cream-300 hover:border-gold-400 hover:text-maroon-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-ink-500 py-16">No items match your search. Try a different keyword.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
