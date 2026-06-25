import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// 1. AMBIL KOD DARI FIREBASE DAN LETAK KAT SINI
const firebaseConfig = {
  apiKey: "AIzaSyBYvvClBO5ZhkchadhGBuOAUgBxuckaTqQ",
  authDomain: "login-bc271.firebaseapp.com",
  projectId: "login-bc271",
  storageBucket: "login-bc271.firebasestorage.app",
  messagingSenderId: "778495345887",
  appId: "1:778495345887:web:671ee0e4bd7a9a808c156a",
  measurementId: "G-S00SS1PC9V"
};

// 2. Initialize Firebase & Auth (Kod ni maintain sama)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
//const appleProvider = new OAuthProvider('apple.com');

// 3. Setup Providers (Kod ni maintain sama)
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// 4. Fungsi Login Google
export const loginDenganGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Berjaya login Google! User:", result.user.displayName);
    return result.user;
  } catch (error) {
    console.error("Gagal login Google:", error.message);
    throw error;
  }
};

// 5. Fungsi Login Apple 
export const loginDenganApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    console.log("Berjaya login Apple! User:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Gagal login Apple:", error.message);
    throw error;
  }
};