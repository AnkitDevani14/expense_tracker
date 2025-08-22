import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simple sign in (dummy user)
  const signIn = () => {
    setUser({ uid: 'test-user', displayName: 'Test User', email: 'test@example.com' });
  };

  // Simple sign out
  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signOut,
    signInWithGoogle: signIn // for compatibility
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 