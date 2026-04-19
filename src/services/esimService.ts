import { ESimPackage, ESimLocation } from '../types/esim';

export const esimService = {
  async getLocations(): Promise<ESimLocation[]> {
    return [
      { locationCode: 'TR', locationName: 'Turkey', type: 'country' },
      { locationCode: 'AE', locationName: 'UAE', type: 'country' },
      { locationCode: 'US', locationName: 'USA', type: 'country' },
      { locationCode: 'EUROPE', locationName: 'Europe', type: 'region' },
    ];
  },

  async queryPackages(_filters: any): Promise<ESimPackage[]> {
    return [
      { packageCode: 'MOCK-1D-500', packageName: '500 MB / Day', packageSlug: '500mb-1d', periodNum: 1, priceMinor: 150, type: 'data', currencyCode: 'USD', dataAmount: 500, locationCode: 'TR', locationName: 'Turkey', slug: '500mb-1d-slug' },
      { packageCode: 'MOCK-7D-3G', packageName: 'Total 3 GB', packageSlug: '3gb-7d', periodNum: 7, priceMinor: 500, type: 'data', currencyCode: 'USD', dataAmount: 3072, locationCode: 'TR', locationName: 'Turkey', slug: '3gb-7d-slug' },
    ];
  },

  async getExchangeRate(_token: string): Promise<any> {
    return { success: true, data: { exchangeRate: '1320' } };
  },

  async createManagedOrder(_token: string, _orderData: any) {
    return { success: true, orderId: 'MOCK-123' };
  },

  async getMyProfiles(_token: string) {
    return { success: true, data: { profiles: [] } };
  }
};
