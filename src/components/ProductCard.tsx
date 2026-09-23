import { useState } from 'react';
import { Plus, MessageCircle, Star } from 'lucide-react';
import type { Product, Weight } from '../types';
import { useCart } from '../CartContext';
import { formatPrice, buildWhatsAppSingleItemUrl } from '../utils';

const WEIGHTS: Weight[] = ['250g', '500g', '1kg'];

const TAG_STYLES: Record<string, string> = {
  'Best Seller': 'bg-maroon-600 text-cream-100',
  'Pure Ghee': 'bg-gold-400 text-maroon-900',
  'Festive Favorite': 'bg-[#25D366] text-white',
  Premium: 'bg-ink-900 text-gold-200',
  Jaggery: 'bg-amber-700 text-cream-100',
  Savory: 'bg-orange-600 text-white',
  Traditional: 'bg-rose-700 text-cream-100',
  'Gift Box': 'bg-purple-700 text-cream-100',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [weight, setWeight] = useState<Weight>('500g');
  const [added, setAdded] = useState(false);

  const price = product.prices[weight];

  const handleAdd = () => {
    addItem(product, weight, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-cream-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${TAG_STYLES[tag] || 'bg-ink-700 text-cream-100'} ${tag === 'Best Seller' ? 'animate-glow-pulse' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-base font-bold text-maroon-700 leading-tight">
            {product.name}
          </h3>
        </div>
        <span className="inline-flex w-fit text-xs font-medium text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full mb-2">
          {product.teluguName}
        </span>
        <p className="text-xs text-ink-500 leading-relaxed mb-3 line-clamp-2">{product.description}</p>

        {/* Weight Selector */}
        <div className="flex gap-1.5 mb-3">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              onClick={() => setWeight(w)}
              aria-pressed={weight === w}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                weight === w
                  ? 'bg-maroon-600 text-cream-100 border-maroon-600'
                  : 'bg-cream-50 text-ink-500 border-cream-300 hover:border-gold-400 hover:text-maroon-600'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3 mt-auto">
          <div>
            <span className="font-display text-xl font-bold text-maroon-700">{formatPrice(price)}</span>
            <span className="text-xs text-ink-300 ml-1">/{weight}</span>
          </div>
          <div className="flex items-center gap-0.5 text-gold-400">
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <Star className="w-3.5 h-3.5 fill-gold-400" />
            <Star className="w-3.5 h-3.5 fill-gold-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              added
                ? 'bg-[#25D366] text-white'
                : 'bg-maroon-600 text-cream-100 hover:bg-maroon-700'
            }`}
          >
            {added ? (
              'Added!'
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Box
              </>
            )}
          </button>
          <a
            href={buildWhatsAppSingleItemUrl(product.name, product.teluguName, weight, price)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
            aria-label={`Order ${product.name} on WhatsApp`}
            title="Instant WhatsApp Order"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
