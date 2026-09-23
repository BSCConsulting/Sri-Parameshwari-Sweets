import { useState } from 'react';
import { Calendar, User, Phone, Package, Heart, Send, Sparkles } from 'lucide-react';
import { buildWhatsAppCateringUrl } from '../utils';

export default function Catering() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    eventDate: '',
    quantity: '',
    preferences: '',
  });

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const orderUrl = buildWhatsAppCateringUrl(form);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="catering" className="py-16 sm:py-24 bg-gradient-to-b from-cream-100 to-cream-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-maroon-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-maroon-600/10 border border-maroon-600/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-maroon-700 font-semibold text-sm">Bulk & Wedding Catering</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon-700 leading-tight mb-4">
              Sweets for Weddings, Gruhapravesham & Corporate Gifting
            </h2>

            <p className="text-ink-500 text-sm sm:text-base leading-relaxed mb-6">
              From intimate housewarmings to grand weddings and corporate Diwali hampers —
              we've been the trusted sweet partner for generations in Madhira since 1977.
              Custom packaging, bulk pricing, and tasting samples available.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Heart, title: 'Weddings & Functions', desc: '10 kg to 500+ kg orders' },
                { icon: Package, title: 'Custom Gift Boxes', desc: 'Bride/groom name printing' },
                { icon: Calendar, title: 'Festival Hampers', desc: 'Diwali, Sankranti, Ugadi' },
                { icon: Sparkles, title: 'Tasting Samples', desc: 'Visit store to taste first' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3.5 bg-white border border-cream-300 rounded-xl"
                >
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gold-50 rounded-lg">
                    <item.icon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-maroon-700">{item.title}</h4>
                    <p className="text-xs text-ink-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white border border-cream-300 rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold text-maroon-700 mb-1">
              Request a Bulk Order Quote
            </h3>
            <p className="text-xs text-ink-500 mb-5">
              Fill in your details and we'll send a personalized quote via WhatsApp.
            </p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(orderUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField icon={User} label="Name">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                  />
                </FormField>
                <FormField icon={Phone} label="Phone">
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91 ..."
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                  />
                </FormField>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <FormField icon={Calendar} label="Event Date">
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                  />
                </FormField>
                <FormField icon={Package} label="Estimated Quantity">
                  <input
                    type="text"
                    required
                    placeholder="e.g., 50 kg or 100 boxes"
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
                  />
                </FormField>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-ink-700 mb-1.5 block">Sweet Preferences</span>
                <textarea
                  placeholder="e.g., Bandar Laddu, Kaju Katli, Mysore Pak — assorted gift boxes"
                  value={form.preferences}
                  onChange={(e) => handleChange('preferences', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-cream-50 border border-cream-300 rounded-lg text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200 resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
                Send Inquiry via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink-700 mb-1.5 block">{label}</span>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
        {children}
      </div>
    </label>
  );
}
