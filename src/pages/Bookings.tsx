import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Lock, Wifi, Plane, Hotel, 
  MapPin, ChevronRight, Settings, Signal, 
  Clock, Download, Info, QrCode
} from 'lucide-react';
import { useAuth } from '../lib/auth';

interface TripsProps {
  setActiveTab: (tab: 'home' | 'bookings' | 'profile') => void;
  setShowAuthModal: (show: boolean) => void;
}

export default function Bookings({ setActiveTab, setShowAuthModal }: TripsProps) {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'esim' | 'flights' | 'hotels'>('all');

  const filters = [
    { id: 'all', label: 'All', icon: <Calendar size={14} /> },
    { id: 'esim', label: 'eSIMs', icon: <Wifi size={14} /> },
    { id: 'flights', label: 'Flights', icon: <Plane size={14} /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel size={14} /> },
  ];

  // Mock Active eSIM Data
  const activeEsim = {
    locationName: 'Turkey',
    locationCode: 'TR',
    dataRemaining: '4.2 GB',
    totalData: '5 GB',
    daysLeft: '14',
    status: 'Active',
  };

  return (
    <motion.div 
      key="bookings" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-background pt-2 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-display font-black tracking-tight text-foreground">Bookings</h2>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted"
        >
          <Settings size={20} />
        </motion.button>
      </div>

      {user ? (
        <div className="flex-1 flex flex-col no-scrollbar overflow-y-auto">
          {/* Quick Filters (Professional Segmented Control) */}
          <div className="grid grid-cols-4 gap-2 mb-6 bg-muted/50 p-1 rounded-2xl">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all ${
                  activeFilter === f.id 
                    ? 'bg-card text-foreground shadow-sm font-black' 
                    : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 font-bold'
                }`}
              >
                {f.icon}
                <span className="text-[9px] uppercase tracking-wider">{f.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeFilter === 'all' || activeFilter === 'esim' ? (
              <motion.div 
                key="esim-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Connectivity</h3>
                  <span className="text-[10px] font-black text-primary uppercase">1 Online</span>
                </div>

                {/* COMPACT eSIM CARD */}
                <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-md">
                  {/* Card Header & Data Row */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-background shadow-sm shrink-0">
                        <img 
                          src={`https://hatscripts.github.io/circle-flags/flags/${activeEsim.locationCode.toLowerCase()}.svg`} 
                          className="w-full h-full object-cover"
                          alt="TR"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-black tracking-tight text-foreground leading-none">{activeEsim.locationName}</h4>
                          <span className="bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-green-500/20">
                            {activeEsim.status}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black tracking-tighter">{activeEsim.dataRemaining}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">/ {activeEsim.totalData}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Integrated Progress Bar & Footer */}
                  <div className="bg-muted/30 px-5 py-4 border-t border-border/50">
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex shadow-inner mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '84%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary"
                      ></motion.div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{activeEsim.daysLeft} Days Left</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors">
                          Top Up
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                      <button className="bg-primary text-white hover:brightness-110 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-primary/20">
                        <Download size={14} /> Install eSIM
                      </button>
                      <button className="bg-card border border-border text-foreground hover:bg-muted flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95">
                        <QrCode size={14} /> Show QR
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4"
              >
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center text-muted-foreground mb-6 shadow-inner">
                  {activeFilter === 'flights' ? <Plane size={32} /> : <Hotel size={32} />}
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2 text-foreground">No active {activeFilter}</h3>
                <p className="text-muted-foreground mb-8 text-xs font-medium leading-relaxed max-w-[180px] mx-auto">Simplify your journey. Book your next {activeFilter.slice(0, -1)} today.</p>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className="primary-gradient text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Explore Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
          <div className="w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center text-muted-foreground mb-8 shadow-2xl glass-shimmer">
            <Lock size={40} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-3 text-foreground font-display">Auth Required</h3>
          <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">Sign in securely to manage your premium travel services and eSIM connectivity.</p>
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="primary-gradient text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}
    </motion.div>
  );
}
