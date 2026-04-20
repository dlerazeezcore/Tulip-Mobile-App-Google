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
import ESim from './pages/ESim';

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
  const [homeView, setHomeView] = useState<'main' | 'esim'>('main');
  
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

  // support static mode
  useEffect(() => {
    // Mock local detection
    setCountryCodeDial('+964');
    setCountryFlag('🇮🇶');
  }, []);

  // Recaptcha init is not needed in mock mode
  useEffect(() => {
    // No-op for UI only mode
  }, [loading]);

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
    <div className={`${isDark ? 'dark' : ''} h-[100dvh] overflow-hidden bg-[var(--background)] text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-white`}>
      
      {/* Invisible Recaptcha Element REQUIRED for phone auth to mount cleanly */}
      <div id="recaptcha-container" className="hidden"></div>
      
      {/* Main Mobile App Container */}
      <div className={`w-full max-w-md mx-auto shadow-2xl relative h-full flex flex-col bg-background lg:border-x lg:border-border/10 overflow-hidden texture-bg transition-colors duration-300 ${isDark ? 'shadow-[0_0_80px_rgba(0,0,0,0.8)]' : 'shadow-black/10'}`}>
        
        {/* Premium Ambient Brand Glows (Only shown in Deep Mode for atmosphere) */}
        {isDark && (
          <>
            <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[500px] bg-primary/15 blur-[100px] pointer-events-none rounded-full z-0 transition-opacity"></div>
            <div className="absolute bottom-[10%] right-[-20%] w-[140%] h-[400px] bg-primary/10 blur-[100px] pointer-events-none rounded-full z-0 transition-opacity"></div>
          </>
        )}
        
        {/* Top Header */}
        {activeTab === 'home' && homeView === 'main' && (
          <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center text-primary dark:text-white transition-colors">
                <TulipLogo size={56} />
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-[0.25em] font-black">
                  {user ? 'Good Morning,' : 'Welcome to'}
                </p>
                <h1 className="text-xl font-bold font-display tracking-tight">
                  {user ? (profile?.displayName?.split(' ')[0] || 'Traveler') : 'Tulip Booking'}
                </h1>
              </div>
            </div>
            <div className="relative cursor-pointer" onClick={() => handleProtectedAction(() => setActiveTab('profile'))}>
               <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground relative hover:bg-muted transition-colors shadow-sm">
                 <Bell size={22} />
                 {user && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>}
               </div>
            </div>
          </header>
        )}
        
        {/* Render simple headers for other tabs if on their main view */}
        {(activeTab !== 'home' || homeView !== 'main') && (
           <div className="h-4"></div> /* Space for the sub-page headers */
        )}

        {/* Content Views */}
        <main className="flex-1 px-6 relative z-10 overflow-y-auto no-scrollbar pb-32">
          <AnimatePresence mode="wait">
            
            {/* HOME VIEW (Explore) */}
            {activeTab === 'home' && (
              <motion.div key={homeView === 'main' ? 'home-main-view' : 'home-esim-view'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                {homeView === 'main' ? (
                  <Home onSelectESim={() => setHomeView('esim')} handleProtectedAction={handleProtectedAction} />
                ) : (
                  <ESim 
                    onBack={() => setHomeView('main')} 
                    onGoToBookings={() => { setHomeView('main'); setActiveTab('bookings'); }}
                    isDark={isDark} 
                    setShowAuthModal={setShowAuthModal} 
                    user={user} 
                  />
                )}
              </motion.div>
            )}

            {/* BOOKINGS VIEW (Protected logic inside) */}
            {activeTab === 'bookings' && (
              <motion.div key="bookings-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <Bookings setActiveTab={setActiveTab} setShowAuthModal={setShowAuthModal} />
              </motion.div>
            )}

            {/* PROFILE VIEW (Protected logic inside) */}
            {activeTab === 'profile' && (
              <motion.div key="profile-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <Profile isDark={isDark} setIsDark={setIsDark} setShowSupportChat={setShowSupportChat} setShowAuthModal={setShowAuthModal} />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-3xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:absolute">
          <div className="flex justify-around items-center px-6 pb-safe pt-3 h-[88px] max-w-md mx-auto relative">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300 relative ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Compass size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} className={`transition-transform duration-300 ${activeTab === 'home' ? 'scale-110 drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]' : ''}`} />
              <span className={`text-[10px] tracking-wider text-center transition-all ${activeTab === 'home' ? 'font-black' : 'font-bold'}`}>Explore</span>
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300 relative ${activeTab === 'bookings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Briefcase size={24} strokeWidth={activeTab === 'bookings' ? 2.5 : 2} className={`transition-transform duration-300 ${activeTab === 'bookings' ? 'scale-110 drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]' : ''}`} />
              <span className={`text-[10px] tracking-wider text-center transition-all ${activeTab === 'bookings' ? 'font-black' : 'font-bold'}`}>Bookings</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300 relative ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} className={`transition-transform duration-300 ${activeTab === 'profile' ? 'scale-110 drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]' : ''}`} />
              <span className={`text-[10px] tracking-wider transition-all ${activeTab === 'profile' ? 'font-black' : 'font-bold'}`}>Profile</span>
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
              className="absolute inset-0 bg-background z-[100] flex flex-col pt-safe"
            >
               <header className="px-6 py-4 flex items-center justify-between border-b border-border">
                 <button onClick={() => setShowAuthModal(false)} className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                   <ChevronRight size={20} className="rotate-90" />
                 </button>
               </header>
               
               <div className="flex-1 flex flex-col justify-start items-center p-6 pt-10 relative">
                 {/* Decorative background glow */}
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[200%] h-[300px] bg-primary/5 blur-[80px] pointer-events-none rounded-full z-0"></div>
                 
                 <div className="w-24 h-24 flex items-center justify-center text-primary dark:text-white mb-2 relative z-10 mt-8">
                   <TulipLogo size={96} />
                 </div>
                 
                 <h2 className="text-3xl font-display font-black tracking-tight mb-2 text-center relative z-10 mt-2">Secure Sign In</h2>
                 <p className="text-muted-foreground text-xs text-center mb-10 max-w-[260px] leading-relaxed relative z-10">
                   Enter your mobile number to sign in or create a new account via secure OTP.
                 </p>

                 <div className="w-full max-w-[340px] relative z-10">
                    {authStep === 'phone' ? (
                      <form onSubmit={handleSendOtp} className="space-y-6">
                        {authError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-2xl text-xs text-center font-medium shadow-sm">
                            {authError.includes('Firebase') ? 'Security check failed. Please try again.' : authError}
                          </div>
                        )}

                        {/* Auth Mode Toggle */}
                        <div className="flex bg-muted p-1.5 rounded-2xl mb-2">
                          <button type="button" onClick={() => setAuthMethod('sms')} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2 ${authMethod === 'sms' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Phone size={14} /> SMS
                          </button>
                          <button type="button" onClick={() => setAuthMethod('whatsapp')} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex justify-center items-center gap-2 ${authMethod === 'whatsapp' ? 'bg-[#25D366] text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                            <MessageCircle size={14} /> WhatsApp
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Mobile Number</label>
                          <div className="flex gap-3">
                            {/* Country Dial Box */}
                            <div className="w-[100px] bg-muted border border-border rounded-2xl flex items-center justify-center gap-2 focus-within:ring-2 focus-within:ring-primary/20 relative overflow-hidden shrink-0 transition-shadow">
                               <span className="text-xl absolute left-3">{countryFlag}</span>
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
                              className="input-field flex-1 h-14 font-mono text-base tracking-wider px-5 rounded-2xl border border-border bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" 
                              disabled={isAuthLoading}
                            />
                          </div>
                        </div>
                        <button 
                          type="submit"
                          disabled={isAuthLoading || !phoneNumber}
                          className="w-full h-14 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 disabled:opacity-50"
                        >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Dynamic Code'}
                        </button>
                        
                        <div className="pt-6 border-t border-border mt-4">
                          <button 
                            type="button" 
                            onClick={() => { loginAsDemo(); setShowAuthModal(false); }}
                            className="w-full h-12 border border-border bg-muted/30 text-foreground font-bold rounded-2xl hover:bg-muted transition-all text-xs active:scale-95 flex justify-center items-center"
                          >
                            Use Test Account
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-6">
                        {authError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-2xl text-xs text-center font-medium shadow-sm">
                            {authError}
                          </div>
                        )}
                        <div className="text-center mb-4 bg-muted p-4 rounded-2xl border border-border">
                          <p className="text-[10px] text-muted-foreground mb-1 font-black uppercase tracking-widest">Code sent to</p>
                          <p className="text-foreground font-mono font-bold tracking-wider text-sm">{countryCodeDial} {phoneNumber}</p>
                          <button type="button" onClick={() => setAuthStep('phone')} className="text-primary text-[9px] uppercase tracking-widest font-black mt-2 hover:underline inline-block">Change Number</button>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="• • • • • •" 
                            className="w-full h-16 bg-card border border-border rounded-2xl text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-bold" 
                            disabled={isAuthLoading}
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isAuthLoading || otpCode.length < 6}
                          className="w-full h-14 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 disabled:opacity-50"
                        >
                          {isAuthLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify & Sign In'}
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
                  <div className="w-10 h-10 flex items-center justify-center text-primary dark:text-white transition-colors">
                    <TulipLogo size={28} />
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
