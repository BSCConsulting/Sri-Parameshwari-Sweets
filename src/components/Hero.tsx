import { Star, ShieldCheck, Sparkles, Clock, MessageCircle, ShoppingBag } from 'lucide-react';
import { CONTACT } from '../data';
import { useCart } from '../CartContext';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: '100% Pure Cow Ghee' },
  { icon: Sparkles, label: 'No Artificial Preservatives' },
  { icon: Clock, label: 'Fresh Daily Batches' },
  { icon: Star, label: `${CONTACT.rating}★ Customer Rated` },
];

const CTA_CLASS =
  'px-7 py-3.5 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-green-900/15 hover:scale-[1.02] flex items-center justify-center gap-2';

export default function Hero() {
  const { itemCount, openCart } = useCart();
  const scrollToCatalog = () =>
    document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });

  const enquiryUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(
    'Hi! I would like to order sweets from Sri Parameswari Sweets.'
  )}`;

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 mandala-bg">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200 rounded-full mb-5">
              <span className="text-gold-600 font-display font-semibold text-sm">Heritage Since 1977</span>
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
              <span className="text-ink-500 text-sm">Madhira, Telangana</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-maroon-700 leading-tight text-balance">
              Pure Desi Ghee Sweets & Traditional Andhra Delights
              <span className="block text-gold-500 text-2xl sm:text-3xl lg:text-4xl mt-2">Since 1977</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-ink-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Crafted with time-honored recipes, premium ingredients, and unmatched authenticity in Madhira for over 4 decades.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={scrollToCatalog}
                className="px-7 py-3.5 bg-maroon-600 text-cream-100 rounded-full font-semibold text-base hover:bg-maroon-700 transition-all shadow-lg shadow-maroon-900/15 hover:shadow-xl hover:scale-[1.02]"
              >
                Explore Catalog
              </button>
              {itemCount > 0 ? (
                <button onClick={openCart} className={CTA_CLASS}>
                  <ShoppingBag className="w-5 h-5" />
                  Review Box & Order ({itemCount})
                </button>
              ) : (
                <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" className={CTA_CLASS}>
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </a>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-white/70 backdrop-blur border border-cream-300 rounded-xl"
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gold-50 rounded-lg">
                    <badge.icon className="w-4 h-4 text-gold-500" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-ink-700">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image collage */}
          <div className="relative animate-fade-in hidden md:block">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.pexels.com/photos/19151506/pexels-photo-19151506.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Indian laddu sweets"
                  className="w-full h-56 object-cover rounded-2xl shadow-xl border-2 border-cream-300"
                  loading="eager"
                />
                <img
                  src="https://images.pexels.com/photos/10514163/pexels-photo-10514163.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Kaju katli"
                  className="w-full h-40 object-cover rounded-2xl shadow-xl border-2 border-cream-300"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.pexels.com/photos/9198596/pexels-photo-9198596.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Gulab jamun"
                  className="w-full h-40 object-cover rounded-2xl shadow-xl border-2 border-cream-300"
                  loading="lazy"
                />
                <img
                  src="https://images.pexels.com/photos/9832636/pexels-photo-9832636.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Murukku snack"
                  className="w-full h-56 object-cover rounded-2xl shadow-xl border-2 border-cream-300"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-full shadow-xl border border-gold-200 flex items-center gap-2 animate-float">
              <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
              <span className="font-display font-bold text-maroon-700">{CONTACT.rating} / 5.0</span>
              <span className="text-xs text-ink-500">Google Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
    </section>
  );
}
