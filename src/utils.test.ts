// Run: npm test   (Node 22.6+ runs .ts directly)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStoredCart, buildWhatsAppOrderUrl, buildWhatsAppSearchUrl, formatPrice } from './utils.ts';
import { PRODUCTS } from './data.ts';

const laddu = PRODUCTS[0];

test('parseStoredCart rehydrates from the live catalog', () => {
  const stale = JSON.stringify([
    { productId: laddu.id, weight: '1kg', quantity: 2, price: 1, name: 'OLD NAME' }, // stale price/name
    { productId: 'does-not-exist', weight: '1kg', quantity: 1 }, // removed product
    { productId: laddu.id, weight: '2kg', quantity: 1 }, // invalid weight
    { productId: laddu.id, weight: '500g', quantity: 0 }, // empty line
    { productId: laddu.id, weight: '500g', quantity: 'abc' }, // garbage
  ]);
  const items = parseStoredCart(stale);
  assert.equal(items.length, 1);
  assert.equal(items[0].price, laddu.prices['1kg']);
  assert.equal(items[0].name, laddu.name);
  assert.equal(items[0].quantity, 2);
});

test('parseStoredCart tolerates bad storage', () => {
  assert.deepEqual(parseStoredCart(null), []);
  assert.deepEqual(parseStoredCart('not json'), []);
  assert.deepEqual(parseStoredCart('{"a":1}'), []);
});

test('WhatsApp order message uses formatted prices', () => {
  const [item] = parseStoredCart(JSON.stringify([{ productId: 'kaju-katli', weight: '1kg', quantity: 1 }]));
  const text = decodeURIComponent(buildWhatsAppOrderUrl([item], item.price, {
    name: 'Ramu', delivery: 'Pickup at Madhira Store', address: '', notes: '',
  }));
  assert.match(text, /Royal Kaju Katli \(1kg\) x 1 = ₹1,200/);
  assert.match(text, /Estimated Total:\* ₹1,200/);
  assert.equal(formatPrice(1450), '₹1,450');
});

test('empty FAQ search does not leave a dangling colon', () => {
  assert.doesNotMatch(decodeURIComponent(buildWhatsAppSearchUrl('  ')), /:\s*$/);
  assert.match(decodeURIComponent(buildWhatsAppSearchUrl('parcel')), /: parcel$/);
});

test('shop pin uses the Madhira store coordinates', async () => {
  const { CONTACT } = await import('./data.ts');
  assert.match(CONTACT.mapsUrl, /16\.9185278/);
  assert.match(CONTACT.mapsUrl, /80\.3621667/);
  assert.match(CONTACT.mapsEmbed, /16\.9185278.*80\.3621667/);
});
