import { CONTACT, PRODUCTS } from './data.ts';
import type { CartItem, DeliveryMethod, Product, Weight } from './types';

export function toCartItem(product: Product, weight: Weight, quantity: number): CartItem {
  return {
    id: `${product.id}-${weight}`,
    productId: product.id,
    name: product.name,
    teluguName: product.teluguName,
    weight,
    price: product.prices[weight],
    quantity,
    image: product.image,
  };
}

/** Rebuild a saved cart from the live catalog so it never carries stale prices or removed products. */
export function parseStoredCart(raw: string | null, catalog: Product[] = PRODUCTS): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry: Partial<CartItem>) => {
      const product = catalog.find((p) => p.id === entry.productId);
      const qty = Number(entry.quantity);
      if (!product || !entry.weight || !(entry.weight in product.prices) || !Number.isInteger(qty) || qty <= 0) return [];
      return [toCartItem(product, entry.weight, qty)];
    });
  } catch {
    return [];
  }
}

export function buildWhatsAppOrderUrl(
  items: CartItem[],
  subtotal: number,
  customer: { name: string; delivery: DeliveryMethod; address: string; notes: string }
): string {
  const lines: string[] = [];
  lines.push('*NEW ORDER - SRI PARAMESWARI SWEETS*');
  lines.push('--------------------------------');
  lines.push(`*Customer Name:* ${customer.name || '—'}`);
  lines.push(`*Delivery Type:* ${customer.delivery}`);
  lines.push(`*Delivery Address:* ${customer.address || '—'}`);
  lines.push('');
  lines.push('*Order Details:*');
  items.forEach((item) => {
    lines.push(
      `- ${item.name} (${item.weight}) x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    );
  });
  lines.push('--------------------------------');
  lines.push(`*Estimated Total:* ${formatPrice(subtotal)}`);
  if (customer.notes) {
    lines.push(`*Special Notes:* ${customer.notes}`);
  }
  lines.push('');
  lines.push('Please confirm availability and dispatch timeline!');

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${CONTACT.phoneRaw}?text=${text}`;
}

export function buildWhatsAppSingleItemUrl(
  productName: string,
  teluguName: string,
  weight: string,
  price: number
): string {
  const text = encodeURIComponent(
    `*Product Inquiry - Sri Parameswari Sweets*\n\n` +
      `*Item:* ${productName} (${teluguName})\n` +
      `*Weight:* ${weight}\n` +
      `*Price:* ${formatPrice(price)}\n\n` +
      `Hi! I'd like to order this item. Please confirm availability.`
  );
  return `https://wa.me/${CONTACT.phoneRaw}?text=${text}`;
}

export function buildWhatsAppCateringUrl(catering: {
  name: string;
  phone: string;
  eventDate: string;
  quantity: string;
  preferences: string;
}): string {
  const text = encodeURIComponent(
    `*BULK / CATERING INQUIRY - SRI PARAMESWARI SWEETS*\n` +
      `--------------------------------\n` +
      `*Name:* ${catering.name || '—'}\n` +
      `*Phone:* ${catering.phone || '—'}\n` +
      `*Event Date:* ${catering.eventDate || '—'}\n` +
      `*Estimated Quantity:* ${catering.quantity || '—'}\n` +
      `*Sweet Preferences:* ${catering.preferences || '—'}\n\n` +
      `Please share a quote and availability for the above.`
  );
  return `https://wa.me/${CONTACT.phoneRaw}?text=${text}`;
}

export function buildWhatsAppSearchUrl(query: string): string {
  const q = query.trim();
  const text = encodeURIComponent(
    q ? `Hi! I have a question about Sri Parameswari Sweets: ${q}` : 'Hi! I have a question about Sri Parameswari Sweets.'
  );
  return `https://wa.me/${CONTACT.phoneRaw}?text=${text}`;
}

export function formatPrice(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
