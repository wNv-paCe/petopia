"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

const AuthContext = createContext();
const db = getFirestore();

const createUserInFirestore = async (uid, email, username = "Anonymous") => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);

    // if user doesn't exist, create user in firestore
    if (!userSnapshot.exists()) {
      await setDoc(userDocRef, {
        email,
        username,
        createdAt: Timestamp.now(),
      });
      console.log("New user written to Firestore.");
    } else {
      console.log("User already exists in Firestore.");
    }
  } catch (error) {
    console.error("Error writing user to Firestore:", error);
  }
};

const handleError = (error) => {
  console.error("Error Code:", error.code);
  console.error("Error Message:", error.message);

  const errorMap = {
    "auth/user-not-found": "No account found with this email.",
    "auth/invalid-credential":
      "Invalid credentials. Please check your email and password.",
    "auth/too-many-requests":
      "Too many login attempts. Please try again later.",
    "auth/popup-closed-by-user":
      "Google Sign-In was canceled. Please try again.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
  };

  return {
    success: false,
    error:
      errorMap[error.code] ||
      error.message ||
      "An error occurred. Please try again.",
  };
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Register user with email and password
  const registerWithEmail = async (email, password, username) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await createUserInFirestore(result.user.uid, email, username);

      setUser(result.user);

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  // Login user with email and password
  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setUser(result.user);

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  // Sign in with Google
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // if user doesn't exist, create user in firestore
      await createUserInFirestore(
        result.user.uid,
        result.user.email,
        result.user.displayName || "Google User"
      );

      setUser(result.user);
      console.log("Google sign-in successful!");

      return { success: true };
    } catch (error) {
      console.error("Google sign-in failed:", error);
      return handleError(error);
    }
  };

  // Sign out user
  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get user data from firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            // Merge user data with auth data
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              username: userData.username || "Anonymous",
            });
          } else {
            // if user data doesn't exist in firestore, use auth data
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || "Anonymous",
            });
          }
        } catch (error) {
          console.error("Failed to fetch Firestore user data:", error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerWithEmail,
        loginWithEmail,
        googleSignIn,
        firebaseSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
