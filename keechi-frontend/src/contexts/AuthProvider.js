// src/contexts/AuthProvider.js - Auth Context Provider for state management
"use client";

import { createContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token is still valid
          try {
            const response = await api.get("/auth/me", {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            setUser(response.data.user);
          } catch (err) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signupUser = async (name, email, password, phone = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/user/signup", {
        name,
        email,
        password,
        phone,
      });

      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/user/login", { email, password });

      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const signupShop = async (
    name,
    email,
    password,
    phone,
    shopName,
    shopAddress,
    shopDescription,
    shopImage
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/shop/signup", {
        name,
        email,
        password,
        phone,
        shopName,
        shopAddress,
        shopDescription,
        shopImage,
      });

      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const loginShop = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/shop/login", { email, password });

      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        signupUser,
        loginUser,
        signupShop,
        loginShop,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
