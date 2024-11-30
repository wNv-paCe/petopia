"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
const db = getFirestore();

const createUserInFirestore = async (uid, email, username) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    email,
    username,
    createdAt: Timestamp.now(),
  });
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

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      setUser(result.user);

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // if user doesn't exist, create user in firestore
      if (result.additionalUserInfo?.isNewUser) {
        await createUserInFirestore(result.user.uid, result.user.email);
      }

      setUser(result.user);

      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  const firebaseSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      return handleError(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
