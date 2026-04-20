import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Globe, ChevronRight, 
  Wifi, CreditCard, Star, CheckCircle2, Zap,
  Check, ArrowRight
} from 'lucide-react';
import { ESimPackage, ESimLocation } from '../types';
import { useEsim } from '../hooks/useEsim';

interface ESimProps {
  onBack: () => void;
  onGoToBookings: () => void;
  setShowAuthModal: (show: boolean) => void;
  isDark: boolean;
  user: any;
}

const RECOMMENDED_PACKAGES = ['MOCK-TR-5G', 'MOCK-AE-5G'];

const pkgDisplayData = (pkg: ESimPackage) => {
  const amount = Number(pkg.dataAmount);
  return amount >= 1024 ? `${amount / 1024} GB` : `${amount} MB`;
};

export default function ESim({ onBack, onGoToBookings, setShowAuthModal, isDark, user }: ESimProps) {
  // Hook for API logic
  const { 
    loading: apiLoading, 
    locations, 
    packages, 
    fetchLocations, 
    fetchPackages, 
    purchasePackage 
  } = useEsim();

  // Component UI States
  const [tab, setTab] = useState<'countries' | 'regions'>('countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ESimLocation | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ESimPackage | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'fib' | 'loyalty'>('fib');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const exchangeRate = 1320;

  const handleLocationSelect = (loc: ESimLocation) => {
    setSelectedLocation(loc);
    setSelectedPackage(null);
    fetchPackages(loc.locationCode);
  };

  const formatPrice = (usdMinor: number) => {
    const isMock = usdMinor < 10000; 
    const usd = isMock ? usdMinor : usdMinor / 100;
    const iqd = Math.round(usd * exchangeRate);
    return iqd.toLocaleString() + ' IQD';
  };

  const filteredLocations = locations.filter(l => 
    l.type === (tab === 'countries' ? 'country' : 'region') &&
    l.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableDays = useMemo(() => {
    return Array.from(new Set(packages.map(p => p.periodNum)))
      .sort((a, b) => (a as number) - (b as number));
  }, [packages]);

  useEffect(() => {
    if (user && selectedPackage && !showCheckout) {
      // Small delay to let the auth modal close smoothly if needed, 
      // though App.tsx handles the modal visibility.
      setShowCheckout(true);
    }
  }, [user]);

  const handlePackageClick = (pkg: ESimPackage) => {
    setSelectedPackage(pkg);
  };

  const handleConfirmSelection = () => {
    if (!selectedPackage) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {!selectedLocation && !showCheckout && (
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0 flex flex-col pt-safe bg-background px-6"
          >
            {/* Consistent Tulip Header */}
            <div className="flex items-center gap-4 mb-4 mt-6 shrink-0">
              <button 
                onClick={onBack}
                className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold font-display leading-none text-foreground">Global eSIM</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1.5">Connectivity Anywhere</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              {/* Premium Search */}
              <div className="relative mb-8 mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search country or region..."
                  className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Popular Destinations Grid - Tulip Styling */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Popular</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {locations.slice(0, 6).map((loc) => (
                    <motion.div 
                      key={`popular-${loc.locationCode}`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLocationSelect(loc)}
                      className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-all group active:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-border/50 group-hover:scale-105 transition-transform bg-muted">
                        <img src={loc.flag} alt={loc.locationName} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-black text-center text-foreground leading-tight">{loc.locationName}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tabs Selector - Consistent with Tulip Switchers */}
              <div className="flex bg-muted p-1 rounded-2xl mb-6 sticky top-0 z-10 w-full backdrop-blur-md">
                <button 
                  onClick={() => setTab('countries')}
                  className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'countries' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Countries
                </button>
                <button 
                  onClick={() => setTab('regions')}
                  className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${tab === 'regions' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                  Regions
                </button>
              </div>

              {/* Location List - Scrollable */}
              <div className="full space-y-3">
                {filteredLocations.map((loc, idx) => (
                  <div 
                    key={`${loc.locationCode}-${idx}`}
                    onClick={() => handleLocationSelect(loc)}
                    className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors border-2 border-background shadow-sm overflow-hidden bg-muted">
                        {loc.type === 'country' ? (
                          <img 
                            src={`https://hatscripts.github.io/circle-flags/flags/${loc.locationCode.toLowerCase()}.svg`} 
                            alt={loc.locationCode}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Globe size={20} className="text-primary" />
                        )}
                      </div>
                      <span className="font-bold text-sm tracking-tight text-foreground">{loc.locationName}</span>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedLocation && !showCheckout && (
          <motion.div 
            key="packages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 flex flex-col bg-background pt-safe px-6"
          >
            {/* Detail Header */}
            <div className="flex items-center gap-4 mb-4 mt-6 shrink-0">
              <button 
                onClick={() => setSelectedLocation(null)}
                className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold font-display leading-none text-foreground">{selectedLocation.locationName}</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1.5">Select a data plan</p>
              </div>
            </div>

            {/* Grouped Minimalist List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-40 space-y-10 pt-4">
              {apiLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={`pkg-group-skeleton-${i}`} className="space-y-4">
                    <div className="h-4 w-32 bg-muted rounded-full animate-pulse ml-2" />
                    <div className="h-24 bg-muted/20 rounded-2xl animate-pulse" />
                  </div>
                ))
              ) : availableDays.length > 0 ? (
                availableDays.map(days => (
                  <div key={`group-${days}`} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-[2px] w-8 bg-gradient-to-r from-primary to-transparent rounded-full" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/70">{days === 1 ? 'Daily' : `${days} Days`} Plan</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {packages
                        .filter(p => p.periodNum === days)
                        .map((pkg, idx) => {
                          const isSelected = selectedPackage?.packageCode === pkg.packageCode;
                          return (
                            <div 
                              key={`${pkg.packageCode}-${idx}`}
                              onClick={() => handlePackageClick(pkg)}
                              className={`group relative flex items-center p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${isSelected ? 'border-primary bg-primary/[0.04] shadow-lg shadow-primary/5' : 'border-border/60 hover:border-border bg-card/40'}`}
                            >
                              {/* Selection Indicator at LEFT */}
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mr-5 flex-shrink-0 ${isSelected ? 'border-primary bg-primary shadow-md shadow-primary/40 scale-110' : 'border-border/60 group-hover:border-primary/40'}`}>
                                {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                              </div>

                              {/* Data and Price in ONE LINE */}
                              <div className="flex-1 flex items-center justify-between gap-3">
                                <h4 className="font-black text-lg tracking-tighter text-foreground leading-none">
                                  {pkgDisplayData(pkg)}
                                </h4>
                                <span className={`text-lg font-black tracking-tight transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                  {formatPrice(pkg.priceMinor)}
                                </span>
                              </div>

                              {/* Selected Subtle Overlay */}
                              {isSelected && (
                                <motion.div 
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                                />
                              )}
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                ))
              ) : null}
            </div>

            {/* Selection Footer - Restored as per request for intermediate flow */}
            <AnimatePresence>
              {selectedPackage && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-[88px] left-0 right-0 px-6 z-[60]"
                >
                   <button 
                    onClick={handleConfirmSelection}
                    className="w-full primary-gradient text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                  >
                     Continue with {pkgDisplayData(selectedPackage)}
                     <ArrowRight size={18} strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {showCheckout && selectedPackage && (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="absolute inset-0 flex flex-col bg-background pt-safe px-3 z-50"
          >
            {!orderSuccess ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold font-display leading-none text-foreground">Checkout</h2>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar space-y-6 pb-40">
                  {/* Summary Card */}
                  <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
                    <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border/50">
                      <div className="w-14 h-14 primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Wifi size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-foreground">{selectedPackage.packageName}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{selectedPackage.periodNum} Days Validity</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 text-foreground">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Data Plan</span>
                        <span className="font-bold">{formatPrice(selectedPackage.priceMinor)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Transaction Fee</span>
                        <span className="font-bold text-green-500">Free</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total to Pay</span>
                        <span className="text-base font-bold text-foreground">Secure Order</span>
                      </div>
                      <span className="text-2xl font-black text-primary tracking-tight">{formatPrice(selectedPackage.priceMinor)}</span>
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Payment Method</h3>
                    
                    <div className="space-y-2">
                      <div 
                        onClick={() => setPaymentMethod('fib')}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${paymentMethod === 'fib' ? 'bg-card border-primary shadow-lg ring-2 ring-primary/10' : 'bg-card border-border opacity-70 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'fib' ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">FIB Bank Transfer</p>
                            <p className="text-[10px] font-bold text-muted-foreground">Instant Connection</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'fib' ? 'border-primary bg-primary' : 'border-border'}`}>
                          {paymentMethod === 'fib' && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('loyalty')}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${paymentMethod === 'loyalty' ? 'bg-card border-primary shadow-lg ring-2 ring-primary/10' : 'bg-card border-border opacity-70 hover:opacity-100'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'loyalty' ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                            <Star size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-sm text-foreground">Loyalty Perks</p>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground">Member Only Benefits</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'loyalty' ? 'border-primary bg-primary' : 'border-border'}`}>
                          {paymentMethod === 'loyalty' && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Pay Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
                  <button 
                    disabled={isProcessing}
                    onClick={handlePayment}
                    className="w-full primary-gradient text-white py-5 rounded-3xl font-bold text-base shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:grayscale"
                  >
                    {isProcessing ? (
                       <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Pay {formatPrice(selectedPackage.priceMinor)}
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-24 h-24 primary-gradient rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black font-display tracking-tight mb-4 text-foreground">Successful!</h2>
                <p className="text-muted-foreground mb-12 leading-relaxed max-w-xs mx-auto text-sm font-medium">
                  Your travel connectivity has been activated. You can find your eSIM profile in the Bookings section under "Active Connectivity".
                </p>
                <div className="w-full space-y-4">
                  <button 
                    onClick={() => onGoToBookings()}
                    className="w-full primary-gradient text-white py-5 rounded-3xl font-bold text-base shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    Manage My eSIMs
                  </button>
                  <button 
                    onClick={() => onBack()}
                    className="w-full bg-card border border-border text-foreground py-5 rounded-3xl font-bold text-base"
                  >
                    Back to Explore
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
