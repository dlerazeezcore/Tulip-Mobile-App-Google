import { apiClient } from '../lib/api';
import { ESimPackage, ESimLocation } from '../types';

/**
 * Service to handle all eSIM related API work
 * Separates API logic from the UI
 */
export const esimService = {
  /**
   * Fetch available eSIM countries/regions
   */
  getLocations: async (): Promise<ESimLocation[]> => {
    // In production, this would be an actual API call
    // return apiClient<ESimLocation[]>('/esim/locations');
    
    // For now, we simulate the structure
    return [
      { locationCode: 'TR', locationName: 'Turkey', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/tr.svg' },
      { locationCode: 'AE', locationName: 'UAE', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/ae.svg' },
      { locationCode: 'GB', locationName: 'United Kingdom', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/gb.svg' },
      { locationCode: 'US', locationName: 'USA', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/us.svg' },
      { locationCode: 'FR', locationName: 'France', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/fr.svg' },
      { locationCode: 'MY', locationName: 'Malaysia', type: 'country', flag: 'https://hatscripts.github.io/circle-flags/flags/my.svg' }
    ];
  },

  /**
   * Fetch specific packages for a location
   */
  getPackages: async (locationCode: string): Promise<ESimPackage[]> => {
    // return apiClient<ESimPackage[]>(`/esim/packages/${locationCode}`);
    
    return [
      { 
        packageCode: `MOCK-${locationCode}-1G`, 
        packageName: '1 GB', 
        packageSlug: '1gb-1d', 
        periodNum: 1, 
        priceMinor: 10, 
        type: 'data', 
        currencyCode: 'USD', 
        dataAmount: 1024, 
        locationCode, 
        locationName: 'Location', 
        slug: '1gb-slug' 
      }
    ];
  },

  /**
   * Finalize a purchase
   */
  purchase: async (packageCode: string, paymentMethod: string) => {
    return apiClient('/esim/purchase', {
      method: 'POST',
      body: JSON.stringify({ packageCode, paymentMethod })
    });
  }
};
