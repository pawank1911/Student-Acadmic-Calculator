"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db, googleProvider } from "@/firebase";
import {
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google";
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

function toUserProfile(fbUser: User): UserProfile {
  return {
    uid: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student",
    email: fbUser.email || "",
    avatar: fbUser.photoURL || undefined,
    provider: "google",
  };
}

async function saveUserProfile(profile: UserProfile) {
  await setDoc(
    doc(db, "users", profile.uid),
    {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar || "",
      provider: profile.provider,
      lastSeen: serverTimestamp(),
    },
    { merge: true }
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);

        const result = await getRedirectResult(auth);
        if (result?.user && mounted) {
          const profile = toUserProfile(result.user);
          setUser(profile);
          setIsModalOpen(false);
          setIsLoading(false);
          saveUserProfile(profile).catch((error) => {
            console.warn("Failed to save redirect user profile", error);
          });
        }
      } catch (error) {
        console.warn("Failed to initialize Firebase auth", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!mounted) return;

      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const profile = toUserProfile(fbUser);

      setUser(profile);
      setIsModalOpen(false);
      setIsLoading(false);

      saveUserProfile(profile).catch((error) => {
        console.warn("Failed to save Firebase user profile", error);
      });
    });

    const loadingFallback = window.setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 2500);

    return () => {
      mounted = false;
      window.clearTimeout(loadingFallback);
      unsubscribe();
    };
  }, []);

  const openAuthModal = useCallback(() => setIsModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsModalOpen(false), []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.warn("Could not set Firebase persistence", error);
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = toUserProfile(result.user);
      setUser(profile);
      setIsModalOpen(false);
      setIsLoading(false);
      saveUserProfile(profile).catch((error) => {
        console.warn("Failed to save popup user profile", error);
      });
    } catch (error: any) {
      const code = error?.code;

      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      if (code !== "auth/popup-closed-by-user") {
        console.error("Google sign-in error:", error);
        alert(`Google sign-in failed: ${error?.message || error}`);
      }

      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn("Failed to sign out", error);
    } finally {
      setUser(null);
      setIsModalOpen(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
