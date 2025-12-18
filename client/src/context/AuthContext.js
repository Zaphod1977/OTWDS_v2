import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode'; // npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token, userData) => {
    localStorage.setItem('jwtToken', token);
    setUser(userData || jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decoded);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;