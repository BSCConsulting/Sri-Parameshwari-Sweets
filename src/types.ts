export type Weight = '250g' | '500g' | '1kg';

export type Category =
  | 'all'
  | 'ghee-specials'
  | 'andhra-sweets'
  | 'kaju-dryfruit'
  | 'savory-mixtures'
  | 'festival-giftboxes';

export interface Product {
  id: string;
  name: string;
  teluguName: string;
  category: Exclude<Category, 'all'>;
  description: string;
  image: string;
  prices: Record<Weight, number>;
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  teluguName: string;
  weight: Weight;
  price: number;
  quantity: number;
  image: string;
}

export interface FAQ {
  id: number;
  category: 'Ingredients' | 'Ordering' | 'Delivery' | 'Catering' | 'Timings';
  question: string;
  answer: string;
}

export type DeliveryMethod = 'Pickup at Madhira Store' | 'Local Madhira Delivery' | 'Inter-City Bus Parcel';
