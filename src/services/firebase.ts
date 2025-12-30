import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder Firebase config. 
const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "auth-domain",
  projectId: "project-id",
  storageBucket: "storage-bucket",
  messagingSenderId: "messaging-sender-id",
  appId: "app-id"
};

const app = initializeApp(firebaseConfig);

// Persistence fix react native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export default app;
