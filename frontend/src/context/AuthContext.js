import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = "https://employee-analytics-system.onrender.com";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;

        const res = await axios.get(
          `${API_URL}/api/auth/me`
        );

        setUser(res.data);

      } catch (error) {

        logout();

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, [token]);

  const login = async (email, password) => {

    const res = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password }
    );

    localStorage.setItem(
      'token',
      res.data.token
    );

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${res.data.token}`;

    setToken(res.data.token);

    const { token: _, ...userData } = res.data;
    setUser(userData);

    return res.data;
  };

  const signup = async (name, email, password) => {

    const res = await axios.post(
      `${API_URL}/api/auth/signup`,
      { name, email, password }
    );

    localStorage.setItem(
      'token',
      res.data.token
    );

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${res.data.token}`;

    setToken(res.data.token);

    const { token: _, ...userData } = res.data;
    setUser(userData);

    return res.data;
  };

  const logout = () => {

    localStorage.removeItem('token');

    delete axios.defaults.headers.common[
      'Authorization'
    ];

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);