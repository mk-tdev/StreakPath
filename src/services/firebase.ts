import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder Firebase config. 
const firebaseConfig = {
  apiKey: "AIzaSyBFxVwUFyWpcuvrPYo1YUSnhAgurNf0WKA",
  authDomain: "streakpath.firebaseapp.com",
  projectId: "streakpath",
  storageBucket: "streakpath.firebasestorage.app",
  messagingSenderId: "528966605322",
  appId: "streakpath"
};

const app = initializeApp(firebaseConfig);

// Persistence fix react native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export default app;
