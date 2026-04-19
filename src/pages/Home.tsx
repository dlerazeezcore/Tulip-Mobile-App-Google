import React from 'react';
import { motion } from 'motion/react';
import { Plane, Hotel, Smartphone, Car, ChevronRight } from 'lucide-react';

interface HomeProps {
  handleProtectedAction: (action: () => void) => void;
}

export default function Home({ handleProtectedAction }: HomeProps) {
  return (
    <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      {/* Search Bar Visual */}
      <div onClick={() => handleProtectedAction(() => {})} className="bg-muted border border-border h-14 rounded-2xl flex items-center px-4 mb-8 cursor-text">
        <Smartphone size={20} className="text-muted-foreground mr-3" />
        <span className="text-muted-foreground text-sm">Where do you want to go?</span>
      </div>

      {/* Services List (Premium Vertical Scalable Layout) */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Our Services</h3>
      </div>
      
      <div className="flex flex-col gap-3 pb-8">
        <div className="bg-card border border-border p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all hover:border-primary/50 cursor-pointer group shadow-sm">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Plane size={24}/>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">Flights</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Book global itineraries seamlessly</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all hover:border-primary/50 cursor-pointer group shadow-sm">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Hotel size={24}/>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">Hotels</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Find & reserve luxury stays</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="bg-card border border-border p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all hover:border-primary/50 cursor-pointer group shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl z-10 shadow-md">Trending</div>
          <div className="w-14 h-14 primary-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Smartphone size={24}/>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base">Global eSIMs</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Instant connectivity worldwide</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ChevronRight size={18} className="text-primary" />
          </div>
        </div>

        <div className="bg-card/50 border border-border border-dashed p-4 rounded-3xl flex items-center gap-4 cursor-not-allowed opacity-60">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
            <Car size={24}/>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base text-muted-foreground">Car Rentals</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Transport services arriving soon</p>
          </div>
          <div className="px-2 py-1 bg-muted rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Soon</div>
        </div>
      </div>
    </motion.div>
  );
}
