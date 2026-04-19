import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Lock, Wifi, Plane, Hotel, 
  MapPin, ChevronRight, Settings, Signal, 
  Clock, Download, Info
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
    expirationDate: 'Oct 24, 2024',
    status: 'Active',
    signalStrength: 4,
  };

  return (
    <motion.div 
      key="bookings" 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-background pt-2"
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
        <div className="flex-1 flex flex-col no-scrollbar overflow-y-auto pb-24">
          {/* Quick Filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeFilter === f.id 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-card border-border text-muted-foreground hover:border-muted'
                }`}
              >
                {f.icon}
                {f.label}
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

                {/* PREMIUM eSIM CARD */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[32px] blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative bg-card border border-border/50 rounded-[30px] overflow-hidden shadow-2xl">
                    {/* Card Header */}
                    <div className="p-6 pb-4 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border border-border/50">
                          <img 
                            src={`https://flagcdn.com/w160/${activeEsim.locationCode.toLowerCase()}.png`} 
                            className="w-full h-full object-cover"
                            alt="TR"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-black tracking-tight text-foreground">{activeEsim.locationName}</h4>
                            <div className="flex items-center gap-0.5 ml-1">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-1 h-3 rounded-full ${i < activeEsim.signalStrength ? 'bg-primary' : 'bg-muted'}`}></div>
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 italic italic">Connected via Tulip Core</p>
                        </div>
                      </div>
                      <div className="bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                        {activeEsim.status}
                      </div>
                    </div>

                    {/* Data Usage Visualization */}
                    <div className="px-6 py-4">
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Data Remaining</span>
                          <span className="text-2xl font-black text-foreground tracking-tighter">{activeEsim.dataRemaining}</span>
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">/{activeEsim.totalData}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden flex shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '84%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full primary-gradient shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-t border-border/40">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Expires {activeEsim.expirationDate}</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-foreground hover:text-primary transition-colors">
                            <Download size={14} />
                         </button>
                         <button className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-foreground hover:text-primary transition-colors">
                            <Info size={14} />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-4">
                   <button className="p-4 bg-card border border-border rounded-2xl flex flex-col items-center gap-2 group hover:border-primary/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                         <Wifi size={20} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Top Up Data</span>
                   </button>
                   <button className="p-4 bg-card border border-border rounded-2xl flex flex-col items-center gap-2 group hover:border-primary/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                         <Signal size={20} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Coverage Map</span>
                   </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4"
              >
                <div className="w-20 h-20 bg-muted rounded-[24px] flex items-center justify-center text-muted-foreground mb-6 shadow-inner">
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
          <div className="w-24 h-24 bg-card border border-border rounded-[32px] flex items-center justify-center text-muted-foreground mb-8 shadow-2xl glass-shimmer">
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
