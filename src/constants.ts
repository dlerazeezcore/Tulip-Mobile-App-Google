import { Plane, Hotel, Smartphone, Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Globe, Zap, CreditCard } from 'lucide-react';

export type ServiceType = 'flights' | 'hotels' | 'esim';

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: string;
  rating: number;
}

export interface ESimPackage {
  id: string;
  country: string;
  data: string;
  duration: string;
  price: string;
  features: string[];
}

export const FEATURED_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://picsum.photos/seed/santorini/800/600',
    price: '$450',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://picsum.photos/seed/kyoto/800/600',
    price: '$820',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://picsum.photos/seed/amalfi/800/600',
    price: '$650',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://picsum.photos/seed/bali/800/600',
    price: '$320',
    rating: 4.7
  }
];

export const ESIM_PACKAGES: ESimPackage[] = [
  {
    id: 'e1',
    country: 'USA Unlimited',
    data: '10GB / Day',
    duration: '30 Days',
    price: '$24.99',
    features: ['5G Network', 'Instant Activation', 'Hotspot Ready']
  },
  {
    id: 'e2',
    country: 'Europe Regional',
    data: '20GB Total',
    duration: '15 Days',
    price: '$18.50',
    features: ['33 Countries', 'Local IP', 'No Roaming Fees']
  },
  {
    id: 'e3',
    country: 'Global Explorer',
    data: '5GB Total',
    duration: '1 Year',
    price: '$45.00',
    features: ['190+ Countries', 'Valid for 1 Year', 'Auto Connect']
  }
];
