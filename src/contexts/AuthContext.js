import React, { useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider, facebookProvider } from "../firebase"; // Assuming firebase is correctly initialized

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure user doc exists and populate with initial data if it's a new user
  const ensureUserDoc = async (firebaseUser) => {
    if (!firebaseUser) return;
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      // Set initial user data, prioritizing existing displayName or email username
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || // Use Firebase's displayName if available (e.g., from Google/Facebook sign-in)
          firebaseUser.email?.split("@")[0] || // Fallback to username from email
          "Anonymous User", // Final fallback
        favorites: {},
        ratings: {},
        isAdmin: false,
        createdAt: serverTimestamp(),
      });
    }
  };

  // --- Favorites ---
  const addFavorite = async (gameId) => {
    if (!user) {
      console.warn("User not logged in. Cannot add favorite.");
      throw new Error("Login required.");
    }
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { favorites: { [gameId]: true } }, { merge: true });
  };

  const removeFavorite = async (gameId) => {
    if (!user) {
      console.warn("User not logged in. Cannot remove favorite.");
      throw new Error("Login required.");
    }
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { [`favorites.${gameId}`]: deleteField() });
  };

  const fetchFavorites = async () => {
    if (!user) return [];
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.favorites ? Object.keys(data.favorites) : [];
    }
    return [];
  };

  const fetchFavoritesRealtime = (callback) => {
    if (!user) return () => {}; // Return a no-op unsubscribe function
    const userRef = doc(db, "users", user.uid);
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data.favorites ? Object.keys(data.favorites) : []);
      } else {
        callback([]); // User doc might not exist yet for new users
      }
    });
  };

  // --- Ratings ---
  const saveRating = async (gameId, value) => {
    if (!user) {
      console.warn("User not logged in. Cannot save rating.");
      throw new Error("Login required.");
    }
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { ratings: { [gameId]: value } }, { merge: true });
  };

  const fetchRating = async (gameId) => {
    if (!user) return 0;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.ratings && data.ratings[gameId] ? data.ratings[gameId] : 0;
    }
    return 0;
  };

  // --- Reviews ---
  // MODIFIED: Removed reviewerName from arguments.
  const submitReview = async (gameId, message, ratingValue) => {
    if (!user) {
      console.warn("User not logged in. Cannot submit review.");
      throw new Error("Login required.");
    }
    if (!message.trim()) {
      console.warn("Review message is empty.");
      throw new Error("Review message cannot be empty.");
    }

    const reviewCollectionRef = collection(db, "games", gameId, "reviews");

    // Derive the display name directly from the authenticated user object
    const finalDisplayName =
      user.displayName ||
      user.email?.split("@")[0] ||
      "Anonymous";

    await addDoc(reviewCollectionRef, {
      userId: user.uid,
      userName: finalDisplayName, // <-- Now consistently derived here
      message: message.trim(),
      rating: ratingValue || 0,
      createdAt: serverTimestamp(),
    });
  };

  const fetchReviewsRealtime = (gameId, callback) => {
    const reviewCollectionRef = collection(db, "games", gameId, "reviews");
    // Order by createdAt to show newest reviews first
    const q = query(reviewCollectionRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const reviews = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(reviews);
    });
  };

  // --- Auth ---
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // After successful login, ensure user document exists for new users
    await ensureUserDoc(result.user);
  };

  const loginWithFacebook = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    // After successful login, ensure user document exists for new users
    await ensureUserDoc(result.user);
  };

  const logout = () => signOut(auth);

  // --- Auth state listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user's data from Firestore or create doc if it doesn't exist
        await ensureUserDoc(firebaseUser);
        // Set user with the firebaseUser object
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []); // Empty dependency array means this runs once on mount

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    fetchFavoritesRealtime,
    saveRating,
    fetchRating,
    submitReview,
    fetchReviewsRealtime,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children once authentication state is known */}
    </AuthContext.Provider>
  );
};