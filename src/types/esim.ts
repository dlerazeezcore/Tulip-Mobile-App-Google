export interface ESimExchangeRate {
  success: boolean;
  data: {
    enableIQD: boolean;
    exchangeRate: string;
    markupPercent: string;
    source: string;
    updatedAt: string;
  };
}

export interface ESimPackage {
  packageCode: string;
  packageName: string;
  packageSlug: string;
  priceMinor: number;
  currencyCode: string;
  periodNum: number;
  dataAmount: number; // in MB or GB depending on provider, we'll normalize
  type: string;
  locationCode: string;
  locationName: string;
  slug: string;
  includedCountries?: string[];
}

export interface ESimLocation {
  locationCode: string;
  locationName: string;
  type: 'country' | 'region';
  image?: string;
}

export interface ESimOrderRequest {
  providerRequest: {
    transactionId: string;
    packageInfoList: {
      packageCode: string;
      count: number;
      price: number;
    }[];
  };
  user: {
    phone: string;
    name: string;
    email: string;
    status: string;
    isLoyalty: boolean;
  };
  platformCode: string;
  platformName: string;
  currencyCode: string;
  providerCurrencyCode: string;
  exchangeRate: number;
  salePriceMinor: number;
  providerPriceMinor: number;
  countryCode: string;
  countryName: string;
  packageCode: string;
  packageSlug: string;
  packageName: string;
  customFields?: Record<string, any>;
}
