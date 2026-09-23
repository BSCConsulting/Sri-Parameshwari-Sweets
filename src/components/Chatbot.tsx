import { useState, useMemo, useEffect, useRef } from 'react';
import { MessageCircle, X, Search, ChevronDown, Send, Sparkles } from 'lucide-react';
import { FAQS, CONTACT } from '../data';
import { buildWhatsAppSearchUrl } from '../utils';

const FAQ_CATEGORIES = ['All', 'Ingredients', 'Ordering', 'Delivery', 'Catering', 'Timings'] as const;
type FAQFilter = (typeof FAQ_CATEGORIES)[number];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQFilter>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = FAQS;
    if (activeCategory !== 'All') {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialogRef.current!;
    if (isOpen && !d.open) d.showModal();
    else if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        id="faq-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-maroon-600 text-cream-100 rounded-full shadow-xl hover:bg-maroon-700 transition-all hover:scale-105 animate-glow-pulse"
      >
        <MessageCircle className="w-5 h-5 text-gold-300" />
        <span className="text-sm font-semibold hidden sm:inline">Ask Sweet Assistant</span>
      </button>

      {/* Chatbot Modal */}
      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        aria-label="Sri Parameswari Helpdesk"
        className="fixed bottom-0 right-0 top-auto left-auto sm:bottom-5 sm:right-5 m-0 w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-none max-w-none p-0 bg-cream-50 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-cream-300"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-maroon-600 text-cream-100">
            <div className="flex items-center gap-3">
              <img src="/emblem.jpg" alt="" className="w-10 h-10 rounded-full ring-2 ring-gold-400/60" />
              <div>
                <h3 className="font-display text-base font-bold">Sri Parameswari Helpdesk</h3>
                <div className="flex items-center gap-1.5 text-xs text-gold-200">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online | Instant Replies
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close helpdesk" className="text-cream-100 hover:text-gold-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 bg-white border-b border-cream-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
              <input
                type="text"
                placeholder={`Search ${FAQS.length} FAQs...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-full text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200"
              />
            </div>
            {/* Category Pills */}
            <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-maroon-600 text-cream-100'
                      : 'bg-cream-100 text-ink-500 hover:bg-gold-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-ink-500 mb-2">No matching answers found.</p>
                <p className="text-xs text-ink-300">Try a different keyword or ask the store owner directly.</p>
              </div>
            ) : (
              filtered.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white border border-cream-300 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    aria-expanded={expandedId === faq.id}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
                  >
                    <span className="text-sm font-semibold text-ink-900 leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-maroon-600 flex-shrink-0 transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-4 pb-3 animate-fade-in">
                      <p className="text-sm text-ink-500 leading-relaxed">{faq.answer}</p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Fallback */}
          <div className="border-t border-cream-300 px-4 py-3 bg-white">
            <p className="text-xs text-ink-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Can't find your answer?
            </p>
            <a
              href={buildWhatsAppSearchUrl(search)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white rounded-full font-semibold text-sm hover:opacity-90 transition-all"
            >
              <Send className="w-4 h-4" />
              Chat with Store Owner on WhatsApp
            </a>
            <p className="text-[10px] text-ink-300 text-center mt-1.5">{CONTACT.phone}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
