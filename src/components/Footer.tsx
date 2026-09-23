import { Phone, MessageCircle, Instagram, MapPin, Clock, Star, Quote } from 'lucide-react';
import { CONTACT } from '../data';

// ponytail: illustrative testimonials written for launch; swap in real customer quotes when available.
const REVIEWS = [
  {
    text: 'Ordered 40 kg of Bandar Laddu and Mysore Pak for my daughter\'s wedding. Every box was fresh, packed beautifully, and guests are still asking where we got them.',
    author: 'Wedding order · Khammam',
    rating: 5,
  },
  {
    text: 'The ghee aroma hits you the moment you open the box. This is the same taste I remember from childhood visits to Madhira.',
    author: 'Regular customer · Madhira',
    rating: 5,
  },
  {
    text: 'Sent a bus parcel to Hyderabad for Diwali. Sweets arrived the same evening, intact and delicious. Smooth WhatsApp ordering.',
    author: 'Bus parcel · Hyderabad',
    rating: 5,
  },
  {
    text: 'Best Madhira mixture and chekkalu in town. Crisp, fresh oil, not oversalted. We pick up a kilo every week.',
    author: 'Weekly customer · Madhira',
    rating: 4,
  },
];

export default function Footer() {
  return (
    <footer id="location" className="bg-ink-900 text-cream-100">
      {/* Map + Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-gold-400 font-semibold text-sm tracking-widest uppercase mb-2">Visit Our Store</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100 mb-2">
            Find Us in Madhira
          </h2>
          <p className="text-cream-300 text-sm">{CONTACT.timings}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border-2 border-gold-400/20 shadow-xl min-h-[300px]">
            <iframe
              src={CONTACT.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Parameswari Sweets Location"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-maroon-800/50 border border-gold-400/20 rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-gold-200 mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="flex items-center gap-3 text-sm hover:text-gold-300 transition-colors"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-maroon-600 rounded-lg flex-shrink-0">
                    <Phone className="w-4 h-4 text-gold-300" />
                  </div>
                  <div>
                    <p className="text-cream-300 text-xs">Phone / WhatsApp</p>
                    <p className="font-semibold">{CONTACT.phone}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${CONTACT.phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-gold-300 transition-colors"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-[#25D366] rounded-lg flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-cream-300 text-xs">WhatsApp Order</p>
                    <p className="font-semibold">Chat with us</p>
                  </div>
                </a>

                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-gold-300 transition-colors"
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gold-300 to-gold-500 rounded-lg flex-shrink-0">
                    <Instagram className="w-4 h-4 text-maroon-900" />
                  </div>
                  <div>
                    <p className="text-cream-300 text-xs">Instagram</p>
                    <p className="font-semibold">{CONTACT.instagramHandle}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 flex items-center justify-center bg-maroon-600 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gold-300" />
                  </div>
                  <div>
                    <p className="text-cream-300 text-xs">Address</p>
                    <p className="font-semibold">{CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 flex items-center justify-center bg-maroon-600 rounded-lg flex-shrink-0">
                    <Clock className="w-4 h-4 text-gold-300" />
                  </div>
                  <div>
                    <p className="text-cream-300 text-xs">Timings</p>
                    <p className="font-semibold">{CONTACT.timings}</p>
                  </div>
                </div>
              </div>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-gold-400 text-maroon-900 rounded-full font-semibold text-sm hover:bg-gold-300 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </a>
            </div>

            {/* Reviews */}
            <h3 className="font-display text-lg font-bold text-gold-200 pt-2">What Our Customers Say</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="bg-maroon-800/50 border border-gold-400/20 rounded-xl p-4"
                >
                  <Quote className="w-5 h-5 text-gold-400 mb-2" />
                  <p className="text-xs text-cream-200 leading-relaxed mb-3 italic">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cream-300">{review.author}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-maroon-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/emblem.jpg" alt="" width={32} height={32} className="w-8 h-8 rounded-full ring-1 ring-gold-400/40" />
            <div>
              <p className="font-display text-sm font-bold text-cream-100">Sri Parameswari Sweets</p>
              <p className="text-[10px] text-cream-300">Heritage Since 1977 • Madhira, Telangana</p>
            </div>
          </div>
          <p className="text-xs text-cream-300 text-center sm:text-right">
            © 1977–2026 Sri Parameswari Sweets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
