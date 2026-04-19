import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Briefcase, User, Phone,
  MessageCircle, Paperclip, Bell, ChevronRight, Send
} from 'lucide-react';
import { ServiceType } from './constants';
import { useAuth } from './lib/auth';
import { TulipLogo } from './components/TulipLogo';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';

// Helper to convert ISO country code to Emoji Flag
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function App() {
  const { user, profile, loading, setupRecaptcha, sendOtp, verifyOtp, logout, loginAsDemo } = useAuth();
  
  // App Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'profile'>('home');
  const [activeService, setActiveService] = useState<ServiceType>('flights');
  
  // Custom Auth Overlay State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'sms' | 'whatsapp'>('sms');

  // Country Auto-Detect State
  const [countryCodeDial, setCountryCodeDial] = useState('+964');
  const [countryFlag, setCountryFlag] = useState('🇮🇶');

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved !== null) return saved === 'dark';
    }
    return true; // default dark
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Support Chat State
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{sender: 'user'|'agent', text: string}[]>([
    { sender: 'agent', text: 'Thank you for reaching out. An agent will be with you shortly.' }
  ]);

  // Handle Geolocation Lookup (runs once)
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country_calling_code && data.country) {
          setCountryCodeDial(data.country_calling_code);
          setCountryFlag(getFlagEmoji(data.country));
        }
      })
      .catch((err) => {
        console.warn("Failed IP location check, defaulting to Iraq +964", err);
      });
  }, []);

  // Initialize Recaptcha globally for Firebase
  useEffect(() => {
    if (!loading) {
      try {
        setupRecaptcha('recaptcha-container');
      } catch (err) {
        console.error("Recaptcha init failed", err);
      }
    }
  }, [loading, setupRecaptcha]);

  // Auth Submit Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      // REGEX: Strip leading zero(s) from local phone inputs
      const normalizedPhone = phoneNumber.replace(/^0+/, '');
      const fullPhoneNumber = `${countryCodeDial}${normalizedPhone}`;
      
      await sendOtp(fullPhoneNumber);
      setAuthStep('otp');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to send OTP. Please try again later.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      await verifyOtp(otpCode);
      setAuthStep('phone');
      setShowAuthModal(false); // Close modal on success
      setPhoneNumber('');
      setOtpCode('');
    } catch (error: any) {
      setAuthError(error.message || 'Invalid code. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    // No automatic follow-up agent response anymore as requested
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-12 h-12 primary-gradient rounded-full animate-bounce"></div></div>;
  }

  // Action guard requiring login
  const handleProtectedAction = (actionCallback: () => void) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      actionCallback();
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-[var(--background)] text-foreground flex font-sans selection:bg-primary/30 selection:text-white pb-24`}>
      
      {/* Invisible Recaptcha Element REQUIRED for phone auth to mount cleanly */}
      <div id="recaptcha-container" className="hidden"></div>
      
      {/* Main Mobile App Container */}
      <div className={`w-full max-w-md mx-auto shadow-2xl relative min-h-screen flex flex-col bg-background lg:border-x lg:border-border/10 overflow-x-hidden texture-bg transition-colors duration-300 ${isDark ? 'shadow-[0_0_80px_rgba(0,0,0,0.8)]' : 'shadow-black/10'}`}>
        
        {/* Premium Ambient Brand Glows (Only shown in Deep Mode for atmosphere) */}
        {isDark && (
          <>
            <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[500px] bg-primary/15 blur-[100px] pointer-events-none rounded-full z-0 transition-opacity"></div>
            <div className="absolute bottom-[10%] right-[-20%] w-[140%] h-[400px] bg-primary/10 blur-[100px] pointer-events-none rounded-full z-0 transition-opacity"></div>
          </>
        )}
        
        {/* Top Header */}
        <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center text-white">
              <TulipLogo size={24} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {user ? 'Good Morning,' : 'Welcome to'}
              </p>
              <h1 className="text-xl font-bold font-display">
                {user ? (profile?.displayName?.split(' ')[0] || 'Traveler') : 'Tulip Booking'}
              </h1>
            </div>
          </div>
          <div className="relative cursor-pointer" onClick={() => handleProtectedAction(() => setActiveTab('profile'))}>
             <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground relative">
               <Bell size={20} />
               {user && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>}
             </div>
          </div>
        </header>

        {/* Content Views */}
        <main className="flex-1 px-6 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* HOME VIEW (Open to all) */}
            {activeTab === 'home' && <Home handleProtectedAction={handleProtectedAction} />}

            {/* BOOKINGS VIEW (Protected logic inside) */}
            {activeTab === 'bookings' && <Bookings setActiveTab={setActiveTab} setShowAuthModal={setShowAuthModal} />}

            {/* PROFILE VIEW (Protected logic inside) */}
            {activeTab === 'profile' && <Profile isDark={isDark} setIsDark={setIsDark} setShowSupportChat={setShowSupportChat} setShowAuthModal={setShowAuthModal} />}

          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border lg:absolute">
          <div className="flex justify-around items-center px-4 pb-safe pt-2 h-20 max-w-md mx-auto">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Compass size={24} className={activeTab === 'home' ? 'fill-current' : ''} />
              <span className="text-[10px] font-bold tracking-wider text-center">Explore</span>
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'bookings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Briefcase size={24} className={activeTab === 'bookings' ? 'fill-current' : ''} />
              <span className="text-[10px] font-bold tracking-wider text-center">Bookings</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <User size={24} className={activeTab === 'profile' ? 'fill-current' : ''} />
              <span className="text-[10px] font-bold tracking-wider">Profile</span>
            </button>
          </div>
        </nav>

        {/* OTP Authentication Modal Overlay */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-background z-[100] flex flex-col"
            >
               <header className="px-6 py-6 flex items-center justify-between border-b border-border">
                 <button onClick={() => setShowAuthModal(false)} className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                   <ChevronRight size={20} className="rotate-90" />
                 </button>
               </header>
               
               <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
                 <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20">
                   <TulipLogo size={32} />
                 </div>
                 
                 <h2 className="text-3xl font-display font-bold mb-3 text-center">Secure Sign In</h2>
                 <p className="text-muted-foreground text-sm text-center mb-10 max-w-xs leading-relaxed">
                   Enter your mobile number to sign in or create a new account via secure OTP.
                 </p>

                 <div className="w-full max-w-sm">
                    {authStep === 'phone' ? (
                      <form onSubmit={handleSendOtp} className="space-y-6">
                        {authError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm text-center">
                            {authError.includes('Firebase') ? 'Security check failed. Please try again.' : authError}
                          </div>
                        )}

                        {/* Auth Mode Toggle */}
                        <div className="flex bg-muted p-1 rounded-xl">
                          <button type="button" onClick={() => setAuthMethod('sms')} className={`flex-1 py-3 px-4 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 ${authMethod === 'sms' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Phone size={14} /> SMS
                          </button>
                          <button type="button" onClick={() => setAuthMethod('whatsapp')} className={`flex-1 py-3 px-4 text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 ${authMethod === 'whatsapp' ? 'bg-green-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
                            <MessageCircle size={14} /> WhatsApp
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Mobile Number</label>
                          <div className="flex gap-2">
                            {/* Country Dial Box */}
                            <div className="w-[100px] bg-muted border border-border rounded-xl flex items-center justify-center gap-1.5 focus-within:ring-1 focus-within:ring-primary/50 relative overflow-hidden shrink-0">
                               <span className="text-lg absolute left-3">{countryFlag}</span>
                               <input 
                                 type="text" 
                                 value={countryCodeDial} 
                                 onChange={(e) => setCountryCodeDial(e.target.value)}
                                 className="w-full h-14 bg-transparent pl-10 pr-2 text-foreground font-mono text-sm focus:outline-none"
                               />
                            </div>
                            
                            {/* Number Input */}
                            <input 
                              type="tel" 
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="750 123 4567" 
                              className="input-field flex-1 h-14 font-mono text-lg tracking-wider" 
                              disabled={isAuthLoading}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2 text-center opacity-70">Leading zeros will be automatically removed.</p>
                        </div>
                        <button 
                          type="submit"
                          disabled={isAuthLoading || !phoneNumber}
                          className="w-full h-14 bg-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50 mt-4"
                        >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Dynamic Code'}
                        </button>
                        
                        <div className="pt-6 border-t border-border mt-8">
                          <button 
                            type="button" 
                            onClick={() => { loginAsDemo(); setShowAuthModal(false); }}
                            className="w-full h-12 border border-primary/40 text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-xs uppercase tracking-widest active:scale-95"
                          >
                            Use Test Account
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-6">
                        {authError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm text-center">
                            {authError}
                          </div>
                        )}
                        <div className="text-center mb-8 bg-muted p-4 rounded-2xl border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Code sent to</p>
                          <p className="text-foreground font-mono font-bold tracking-wider">{countryCodeDial} {phoneNumber}</p>
                          <button type="button" onClick={() => setAuthStep('phone')} className="text-primary text-[10px] uppercase tracking-widest font-bold mt-3 hover:underline">Change Number</button>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            required
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="• • • • • •" 
                            className="input-field w-full h-16 text-center font-mono text-2xl tracking-[1em]" 
                            maxLength={6}
                            disabled={isAuthLoading}
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isAuthLoading || otpCode.length < 6}
                          className="w-full h-14 bg-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50 mt-4"
                        >
                           {isAuthLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify & Enter'}
                        </button>
                      </form>
                    )}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Screen Support Chat Overlay */}
        <AnimatePresence>
          {showSupportChat && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-background z-[100] flex flex-col pt-safe"
            >
              <header className="px-6 py-5 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center border-2 border-background shadow-lg">
                    <TulipLogo size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Tulip Support</h3>
                    <p className="text-[10px] text-green-400 capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowSupportChat(false)} className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground">
                  <ChevronRight size={20} className="rotate-90" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm'}`}>
                       {msg.text}
                     </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-card border-t border-border fixed bottom-0 w-full max-w-md pb-safe">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors bg-muted rounded-full shrink-0 relative overflow-hidden group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Paperclip size={20} />
                  </button>
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-card border border-border rounded-full px-5 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button type="submit" disabled={!chatMessage.trim()} className="p-3 text-white bg-primary disabled:bg-muted disabled:text-muted-foreground rounded-full shrink-0 transition-colors shadow-lg">
                    <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
