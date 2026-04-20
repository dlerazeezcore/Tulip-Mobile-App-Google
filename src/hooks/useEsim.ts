import { useState, useCallback } from 'react';
import { esimService } from '../services/esimService';
import { ESimPackage, ESimLocation } from '../types';

/**
 * Custom Hook for eSIM UI Logic
 * Bridges the ESim service with React components
 */
export function useEsim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<ESimLocation[]>([]);
  const [packages, setPackages] = useState<ESimPackage[]>([]);

  // Actions
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await esimService.getLocations();
      setLocations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackages = useCallback(async (locationCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await esimService.getPackages(locationCode);
      setPackages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  const purchasePackage = async (packageCode: string, paymentMethod: string) => {
    setLoading(true);
    try {
      await esimService.purchase(packageCode, paymentMethod);
      return true;
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    locations,
    packages,
    fetchLocations,
    fetchPackages,
    purchasePackage
  };
}
