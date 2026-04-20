/**
 * Shared Data Models for Tulip Booking
 * These represent the core entities independent of UI or API
 */

export interface ESimPackage {
  packageCode: string;
  packageName: string;
  packageSlug: string;
  priceMinor: number;
  periodNum: number;
  locationCode: string;
  type: string;
  currencyCode: string;
  dataAmount: number;
  locationName: string;
  slug: string;
}

export interface ESimLocation {
  locationCode: string;
  locationName: string;
  type: 'country' | 'region' | 'global';
  flag?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'esim' | 'car';
  status: 'pending' | 'confirmed' | 'cancelled';
  details: any;
  date: string;
}
