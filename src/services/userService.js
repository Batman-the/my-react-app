// services/userService.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createUserDoc = async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      favorites: [],
    },
    { merge: true } // ✅ prevents overwriting existing favorites
  );
};
