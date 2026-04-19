import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  setupRecaptcha: (containerId: string) => void;
  sendOtp: (currPhone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: () => void;
  updateProfile: (data: Partial<any>) => Promise<void>;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: ConfirmationResult | undefined;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch or create profile
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // Create default profile relying on phone number
          const newProfile = {
            uid: user.uid,
            phoneNumber: user.phoneNumber || null,
            email: user.email || null,
            displayName: user.displayName || 'Traveler',
            photoURL: user.photoURL || '',
            membershipLevel: 'Basic',
            notificationsEnabled: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          await setDoc(userDoc, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setupRecaptcha = (containerId: string) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
      });
    }
  };

  const sendOtp = async (phoneNumber: string) => {
    if (!window.recaptchaVerifier) {
      throw new Error('Recaptcha not initialized');
    }
    const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    window.confirmationResult = result;
  };

  const verifyOtp = async (code: string) => {
    if (!window.confirmationResult) {
      throw new Error('OTP Request missing');
    }
    await window.confirmationResult.confirm(code);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  };

  const loginAsDemo = () => {
    setIsDemo(true);
  };

  const logout = async () => {
    setIsDemo(false);
    await signOut(auth);
  };

  const updateProfile = async (data: Partial<any>) => {
    if (!user || isDemo) return;
    const userDoc = doc(db, 'users', user.uid);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await setDoc(userDoc, updateData, { merge: true });
    setProfile((prev: any) => ({ ...prev, ...updateData }));
  };

  const effectiveUser = isDemo ? { uid: 'demo-123', phoneNumber: '+9647501234567' } as User : user;
  const effectiveProfile = isDemo ? {
    displayName: 'Demo Traveler',
    phoneNumber: '+964 750 123 4567',
    email: 'demo@tulip.com',
    membershipLevel: 'Gold',
    notificationsEnabled: true,
    photoURL: ''
  } : profile;

  return (
    <AuthContext.Provider value={{ 
      user: effectiveUser, 
      profile: effectiveProfile, 
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
