import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, firebaseConfigError } from '../utils/firebase';

const AuthContext = createContext(null);
const devAuthEnabled = import.meta.env.DEV;

function buildDevUser(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const payload = {
    uid: `dev-${normalizedEmail || 'user'}`,
    email: normalizedEmail,
    name: normalizedEmail.split('@')[0] || 'Dev User'
  };
  const encodedPayload = btoa(JSON.stringify(payload));

  return {
    email: normalizedEmail,
    getIdToken: async () => `dev:${encodedPayload}`
  };
}

function readDevUser() {
  if (!devAuthEnabled) return null;
  try {
    const stored = window.localStorage.getItem('sapna-dev-auth');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed?.email) return null;
    return buildDevUser(parsed.email);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readDevUser());
  const [loading, setLoading] = useState(!devAuthEnabled && !firebaseConfigError);

  useEffect(() => {
    if (devAuthEnabled) {
      setLoading(false);
      return () => {};
    }

    if (!auth) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configError: devAuthEnabled ? '' : firebaseConfigError,
      login: (email, password) => {
        if (devAuthEnabled) {
          const nextUser = buildDevUser(email);
          window.localStorage.setItem('sapna-dev-auth', JSON.stringify({ email: nextUser.email }));
          setUser(nextUser);
          return Promise.resolve(nextUser);
        }

        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is unavailable.');
        }
        return signInWithEmailAndPassword(auth, email, password);
      },
      signup: (email, password) => {
        if (devAuthEnabled) {
          const nextUser = buildDevUser(email);
          window.localStorage.setItem('sapna-dev-auth', JSON.stringify({ email: nextUser.email }));
          setUser(nextUser);
          return Promise.resolve(nextUser);
        }

        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is unavailable.');
        }
        return createUserWithEmailAndPassword(auth, email, password);
      },
      resetPassword: (email) => {
        if (devAuthEnabled) {
          return Promise.resolve({ email });
        }

        if (!auth) {
          throw new Error(firebaseConfigError || 'Firebase auth is unavailable.');
        }
        if (!email) {
          throw new Error('No email address is available for this account.');
        }
        return sendPasswordResetEmail(auth, email);
      },
      logout: () => {
        if (devAuthEnabled) {
          window.localStorage.removeItem('sapna-dev-auth');
          setUser(null);
          return Promise.resolve();
        }

        if (!auth) {
          return Promise.resolve();
        }
        return signOut(auth);
      },
      deleteCurrentUser: async () => {
        if (devAuthEnabled) {
          window.localStorage.removeItem('sapna-dev-auth');
          setUser(null);
          return true;
        }

        if (!auth?.currentUser) {
          return false;
        }
        await deleteUser(auth.currentUser);
        return true;
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
