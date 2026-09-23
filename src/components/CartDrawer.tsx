import { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Send } from 'lucide-react';
import { useCart } from '../CartContext';
import { formatPrice, buildWhatsAppOrderUrl } from '../utils';
import type { DeliveryMethod } from '../types';

const DELIVERY_OPTIONS: DeliveryMethod[] = [
  'Pickup at Madhira Store',
  'Local Madhira Delivery',
  'Inter-City Bus Parcel',
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, clearCart, itemCount } = useCart();
  const [name, setName] = useState('');
  const [delivery, setDelivery] = useState<DeliveryMethod>('Pickup at Madhira Store');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Native <dialog> handles Escape, focus trap, and keeps the closed drawer out of the tab order.
  useEffect(() => {
    const d = dialogRef.current!;
    if (isOpen && !d.open) d.showModal();
    else if (!isOpen && d.open) d.close();
  }, [isOpen]);

  const orderUrl = buildWhatsAppOrderUrl(items, subtotal, { name, delivery, address, notes });
  const canSend = name.trim().length > 0;

  const goToCatalog = () => {
    closeCart();
    document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      onClick={(e) => e.target === e.currentTarget && closeCart()}
      aria-label="Your Sweet Box"
      className="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full sm:w-[440px] max-w-none p-0 bg-cream-50 shadow-2xl animate-fade-in"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-maroon-600 text-cream-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-300" />
            <h2 className="font-display text-lg font-bold">Your Sweet Box</h2>
            {itemCount > 0 && (
              <span className="bg-gold-400 text-maroon-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="text-cream-100 hover:text-gold-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-cream-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-maroon-700 mb-2">Your box is empty</h3>
            <p className="text-sm text-ink-500 mb-6">
              Browse our catalog and add your favorite sweets to get started.
            </p>
            <button
              onClick={goToCatalog}
              className="px-6 py-2.5 bg-maroon-600 text-cream-100 rounded-full font-semibold text-sm hover:bg-maroon-700 transition-colors"
            >
              Explore Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white border border-cream-300 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold text-maroon-700 truncate">{item.name}</h4>
                    <p className="text-xs text-gold-600 mb-1">{item.teluguName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="w-6 h-6 flex items-center justify-center text-maroon-600 hover:bg-cream-200 rounded"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold text-ink-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="w-6 h-6 flex items-center justify-center text-maroon-600 hover:bg-cream-200 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-ink-500">{item.weight}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-display text-sm font-bold text-maroon-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-ink-300 hover:text-maroon-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="text-xs text-ink-300 hover:text-maroon-600 transition-colors w-full text-center pt-2"
              >
                Clear all items
              </button>

              {/* Customer fields */}
              <div className="border-t border-cream-300 pt-4 mt-2 space-y-3">
                <h3 className="font-display text-sm font-bold text-maroon-700">Delivery Details</h3>

                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your Full Name *"
                  aria-label="Your full name (required)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                />

                <div className="grid grid-cols-1 gap-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDelivery(opt)}
                      aria-pressed={delivery === opt}
                      className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        delivery === opt
                          ? 'bg-maroon-600 text-cream-100 border-maroon-600'
                          : 'bg-white text-ink-700 border-cream-300 hover:border-gold-400'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border-2 ${delivery === opt ? 'border-gold-300 bg-gold-300' : 'border-cream-400'}`} />
                      {opt}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  autoComplete="street-address"
                  placeholder="Delivery Address / Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                />

                <textarea
                  placeholder="Special Instructions (e.g., Pack in 2 separate boxes for gifting)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-cream-300 px-5 py-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Estimated Total</span>
                <span className="font-display text-2xl font-bold text-maroon-700">{formatPrice(subtotal)}</span>
              </div>
              <a
                href={canSend ? orderUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canSend}
                className={`w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white rounded-full font-semibold text-base transition-all shadow-lg ${
                  canSend ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                Send Order to WhatsApp
              </a>
              <p className="text-[11px] text-ink-300 text-center flex items-center justify-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {canSend ? 'Opens WhatsApp with your order details pre-filled' : 'Enter your name above to send the order'}
              </p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
