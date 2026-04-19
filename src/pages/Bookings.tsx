import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Lock } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface TripsProps {
  setActiveTab: (tab: 'home' | 'bookings' | 'profile') => void;
  setShowAuthModal: (show: boolean) => void;
}

export default function Trips({ setActiveTab, setShowAuthModal }: TripsProps) {
  const { user } = useAuth();

  return (
    <motion.div key="bookings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <h2 className="text-3xl font-display font-bold mb-8">Bookings</h2>
      
      {user ? (
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center mt-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
            <Calendar size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No active bookings</h3>
          <p className="text-muted-foreground mb-6 text-sm">Looks like you haven't planned any trips yet.</p>
          <button onClick={() => setActiveTab('home')} className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20">
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center mt-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
            <Lock size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Sign in required</h3>
          <p className="text-muted-foreground mb-6 text-sm">Sign in securely to view and manage your travel bookings.</p>
          <button onClick={() => setShowAuthModal(true)} className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20">
            Sign In / Sign Up
          </button>
        </div>
      )}
    </motion.div>
  );
}
