import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserState } from '../utils/types';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analytics } from '../services/analytics';

const GUEST_NAME_KEY = '@streakpath_guest_name';

interface AuthContextType {
  userState: UserState;
  guestName: string;
  setGuestName: (name: string) => Promise<void>;
  loginAsGuest: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>({ isGuest: false, user: null });
  const [guestName, setGuestNameState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved guest name on startup
    loadGuestName();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserState({
          isGuest: false,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        });
      } else {
        setUserState({ isGuest: false, user: null });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadGuestName = async () => {
    try {
      const savedName = await AsyncStorage.getItem(GUEST_NAME_KEY);
      if (savedName) {
        setGuestNameState(savedName);
      }
    } catch (error) {
      console.error('Failed to load guest name', error);
    }
  };

  const setGuestName = async (name: string) => {
    try {
      await AsyncStorage.setItem(GUEST_NAME_KEY, name);
      setGuestNameState(name);
    } catch (error) {
      console.error('Failed to save guest name', error);
    }
  };

  const loginAsGuest = async (name?: string) => {
    try {
      setLoading(true);
      if (name) {
        await setGuestName(name);
      }
      setUserState({ isGuest: true, user: null });
      
      // Analytics: Track guest login
      Analytics.events.loginGuest(!!name);
      Analytics.setUserProperty('user_type', 'guest');
      if (name) {
        Analytics.setUserProperty('has_name', 'true');
      }
    } catch (error) {
      console.error('Guest login failed', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUserState({ isGuest: false, user: null });
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userState, guestName, setGuestName, loginAsGuest, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
