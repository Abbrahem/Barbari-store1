import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({ user: null, authReady: false });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, authReady }), [user, authReady]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
