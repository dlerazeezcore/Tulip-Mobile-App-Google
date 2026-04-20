import React from 'react';
import { motion } from 'motion/react';
import { Plane, Hotel, Smartphone, Car, ChevronRight } from 'lucide-react';

interface HomeProps {
  handleProtectedAction: (action: () => void) => void;
  onSelectESim: () => void;
}

export default function Home({ handleProtectedAction, onSelectESim }: HomeProps) {
  return (
    <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      {/* Services List Grid (Premium Vertical Stack) */}
      <div className="flex flex-col gap-3 pb-12 mt-2">
        
        {/* Action List */}
        <div 
          onClick={onSelectESim}
          className="w-full bg-card border border-border/60 p-5 rounded-3xl flex items-center gap-5 active:scale-[0.98] transition-all hover:border-primary/50 cursor-pointer group shadow-sm hover:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary/10 text-primary border-b border-l border-primary/20 text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-xl z-10">Top Pick</div>
          
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
            <Smartphone size={26} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-foreground leading-tight">Global eSIMs</h4>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Instant connectivity in 150+ countries</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </div>

        <div className="w-full bg-card border border-border/60 p-5 rounded-3xl flex items-center gap-5 active:scale-[0.98] transition-all hover:border-sky-500/50 cursor-pointer group shadow-sm hover:shadow-md overflow-hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border border-sky-500/20 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:from-sky-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300 shrink-0">
            <Plane size={26} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-foreground leading-tight">Flights</h4>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Book global itineraries instantly</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </div>

        <div className="w-full bg-card border border-border/60 p-5 rounded-3xl flex items-center gap-5 active:scale-[0.98] transition-all hover:border-purple-500/50 cursor-pointer group shadow-sm hover:shadow-md overflow-hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:from-purple-500 group-hover:to-fuchsia-500 group-hover:text-white transition-all duration-300 shrink-0">
            <Hotel size={26} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-foreground leading-tight">Hotels</h4>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Reserve luxury stays worldwide</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform">
            <ChevronRight size={20} />
          </div>
        </div>

        {/* Coming Soon Row */}
        <div className="w-full bg-card border border-border/60 border-dashed p-5 rounded-3xl flex items-center gap-5 cursor-not-allowed opacity-70">
          <div className="w-14 h-14 bg-neutral-500/10 border border-neutral-500/20 rounded-2xl flex items-center justify-center text-neutral-500 shrink-0">
            <Car size={26} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-muted-foreground leading-tight">Car Rentals</h4>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">In Development</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
