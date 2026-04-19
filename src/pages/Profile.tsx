import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Moon, Sun, MessageCircle, LogOut, Edit2, ChevronRight, ArrowLeft, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface ProfileProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  setShowSupportChat: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
}

export default function Profile({ isDark, setIsDark, setShowSupportChat, setShowAuthModal }: ProfileProps) {
  const { user, profile, logout, updateProfile } = useAuth();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  // Local form state
  const [editName, setEditName] = useState(profile?.displayName || '');
  const [editEmail, setEditEmail] = useState(profile?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: editName,
        email: editEmail
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditingInfo(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const PersonalInfoView = () => (
    <motion.div 
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setIsEditingInfo(false)}
          className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-bold">Personal Information</h3>
      </div>

      <form onSubmit={handleSaveInfo} className="space-y-5 mt-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-colors hover:border-primary/50"
            />
          </div>
        </div>

        {/* Phone Field (Read Only as derived from DB/Auth) */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative opacity-60">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              value={profile?.phoneNumber || user?.phoneNumber || 'No phone number'}
              readOnly
              className="w-full bg-muted border border-border rounded-2xl pl-12 pr-4 py-4 text-sm cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-muted-foreground ml-1">Phone number is verified and cannot be changed.</p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="email" 
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Add your email"
              className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-colors hover:border-primary/50"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSaving || saveSuccess}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              saveSuccess 
                ? 'bg-green-500 text-white shadow-green-500/20' 
                : 'bg-primary text-white shadow-primary/20 hover:brightness-110 active:scale-95'
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={18} />
                Changes Saved
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
      <AnimatePresence mode="wait">
        {!isEditingInfo ? (
          <motion.div 
            key="main" 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 20, opacity: 0 }}
          >
            <h2 className="text-3xl font-display font-bold mb-8">Profile</h2>
            
            {user ? (
              <>
                {/* Logged in User Info Card */}
                <div className="bg-card border border-border rounded-3xl p-6 mb-8 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center p-0.5 relative">
                    <img src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-lg leading-tight truncate">
                      {profile?.displayName || 'Traveler'}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70">{user?.phoneNumber || 'No phone'}</p>
                    {profile?.email && (
                       <p className="text-xs text-muted-foreground truncate mt-1">{profile.email}</p>
                    )}
                    {!profile?.email && (
                       <button 
                         onClick={() => {
                           setEditName(profile?.displayName || '');
                           setEditEmail('');
                           setIsEditingInfo(true);
                         }}
                         className="text-[10px] bg-primary text-white hover:brightness-110 px-3 py-1.5 rounded-lg mt-2 inline-flex items-center gap-1.5 font-bold uppercase tracking-wide transition-all active:scale-95 shadow-sm"
                       >
                         <Mail size={12} />
                         Add Email
                       </button>
                    )}
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div 
                      className="px-5 py-4 border-b border-border flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setEditName(profile?.displayName || '');
                        setEditEmail(profile?.email || '');
                        setIsEditingInfo(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-primary" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Personal Information</span>
                          <span className="text-[10px] text-muted-foreground">Click to edit name and email</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Edit2 size={14} className="text-muted-foreground" />
                        <ChevronRight size={18} className="text-muted-foreground" />
                      </div>
                    </div>
                    <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-primary" />
                        <span className="font-medium text-sm">Push Notifications</span>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-colors relative ${profile?.notificationsEnabled !== false ? 'bg-primary' : 'bg-muted'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile?.notificationsEnabled !== false ? 'left-7' : 'left-1'}`}></span>
                      </button>
                    </div>
                    <div className="px-5 py-4 border-b border-border flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsDark(!isDark)}>
                      <div className="flex items-center gap-3">
                        {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                        <span className="font-medium text-sm">Theme</span>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted border border-border'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isDark ? 'left-7' : 'left-1'}`}></span>
                      </button>
                    </div>
                    <div className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setShowSupportChat(true)}>
                      <div className="flex items-center gap-3">
                        <MessageCircle size={18} className="text-primary" />
                        <span className="font-medium text-sm">Online Support Chat</span>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 flex items-center gap-3 cursor-pointer hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-muted-foreground" onClick={logout}>
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Log Out safely</span>
                      </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center mt-12 shadow-xl">
                <div className="w-20 h-20 primary-gradient rounded-full flex items-center justify-center text-white mb-6">
                  <User size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Create your Profile</h3>
                <p className="text-muted-foreground mb-8 text-sm px-4">Sign in or sign up securely via OTP to manage preferences, access 24/7 support, and view trips.</p>
                <button onClick={() => setShowAuthModal(true)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-95">
                  Secure Sign In / Sign Up
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <PersonalInfoView key="editing" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
