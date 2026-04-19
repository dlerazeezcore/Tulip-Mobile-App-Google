import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  accessToken: string | null;
  loading: boolean;
  setupRecaptcha: (containerId: string) => void;
  sendOtp: (currPhone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
  updateProfile: (data: Partial<any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = (containerId: string) => {
    console.log('Mock Recaptcha setup for', containerId);
  };

  const sendOtp = async (phoneNumber: string) => {
    console.log('Mock Send OTP to', phoneNumber);
  };

  const verifyOtp = async (code: string) => {
    console.log('Mock Verify OTP', code);
    loginAsDemo();
  };

  const loginAsDemo = () => {
    setUser({ uid: 'demo-123', phoneNumber: '+9647501234567' });
    setProfile({
      displayName: 'Demo Traveler',
      phoneNumber: '+964 750 123 4567',
      email: 'demo@tulip.com',
      membershipLevel: 'Gold',
      isLoyalty: true,
      notificationsEnabled: true,
      photoURL: ''
    });
    setAccessToken('mock_token_123');
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    setAccessToken(null);
  };

  const updateProfile = async (data: Partial<any>) => {
    setProfile((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      accessToken,
      loading, 
      setupRecaptcha, 
      sendOtp, 
      verifyOtp, 
      logout,
      loginAsDemo,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
