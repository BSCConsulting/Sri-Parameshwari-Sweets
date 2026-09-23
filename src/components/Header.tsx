import { useState, useEffect } from 'react';
import { Phone, Instagram, ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../CartContext';
import { CONTACT } from '../data';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Heritage Catalog', href: '#catalog' },
  { label: 'Bulk & Catering', href: '#catering' },
  { label: 'Location', href: '#location' },
  { label: 'FAQ Chatbot', href: '#faq-trigger' },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el instanceof HTMLButtonElement) el.click(); // e.g. the floating FAQ trigger
    else el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-maroon-600 text-cream-100 text-xs sm:text-sm py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-gold-300 flex-shrink-0" />
          <p className="truncate">
            <span className="font-medium">Legacy of Purity Since 1977</span>
            <span className="mx-2 text-gold-300">|</span>
            100% Pure Desi Ghee
            <span className="mx-2 text-gold-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Same-Day Madhira Delivery & Bus Parcel across Khammam/Vijayawada</span>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-maroon-900/5'
            : 'bg-cream-50'
        } border-b border-cream-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="flex items-center gap-3 group">
              <img
                src="/emblem.jpg"
                alt=""
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md ring-2 ring-gold-400/40 group-hover:ring-gold-400/70 transition-all"
              />
              <div className="leading-tight">
                <h1 className="font-display text-base sm:text-lg font-bold text-maroon-700 tracking-wide">
                  Sri Parameswari Sweets
                </h1>
                <p className="text-[10px] sm:text-xs text-ink-500 font-medium tracking-wider uppercase">
                  Madhira • Est. 1977
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-2 text-sm font-medium text-ink-700 hover:text-maroon-600 hover:bg-gold-50 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-maroon-600 text-cream-100 rounded-full text-sm font-semibold hover:bg-maroon-700 transition-all shadow-sm hover:shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden md:inline">Call Now</span>
              </a>

              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-gold-300 to-gold-500 text-maroon-800 rounded-full hover:scale-105 transition-transform shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <button
                onClick={openCart}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-cream-100 text-maroon-700 border border-cream-300 rounded-full hover:bg-gold-50 transition-all"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 text-maroon-900 text-xs font-bold rounded-full flex items-center justify-center animate-glow-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center text-maroon-700"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-cream-50 border-t border-cream-300 animate-fade-in">
            <nav className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-gold-50 hover:text-maroon-600 rounded-lg transition-all"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="flex items-center gap-2 px-4 py-2.5 mt-2 bg-maroon-600 text-cream-100 rounded-lg text-sm font-semibold"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
