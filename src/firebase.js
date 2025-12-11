// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9A4t2E-Sf154HvTMRrz5-H4dEQN8vnK4",
  authDomain: "gamehub-5beb8.firebaseapp.com",
  projectId: "gamehub-5beb8",
  storageBucket: "gamehub-5beb8.appspot.com",
  messagingSenderId: "865057082897",
  appId: "1:865057082897:web:662ec7b2824ec088c46bb0",
  measurementId: "G-TZF8V2ZGMN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider(); // Ready for Facebook login

// Firestore Database
export const db = getFirestore(app);

export default app;
