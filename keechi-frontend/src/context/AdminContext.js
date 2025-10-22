// src/context/AdminContext.js - Secure Admin State Management
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize admin session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("adminUser");
    
    if (savedToken && savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setToken(savedToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
        
        // Verify token with backend
        verifyToken(savedToken);
      } catch (err) {
        console.error("Error restoring admin session:", err);
        clearAdminSession();
      }
    }
    
    setLoading(false);
  }, []);

  // Verify token validity with backend
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.get(`${API_BASE}/admin/verify`, {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });
      
      if (response.status === 200) {
        // Token is valid
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      clearAdminSession();
    }
  };

  // Admin login
  const login = async (password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE}/admin/login`, {
        password,
      });

      const { token: newToken, admin: adminData } = response.data;

      // Store in localStorage
      localStorage.setItem("adminToken", newToken);
      localStorage.setItem("adminUser", JSON.stringify(adminData));

      // Update state
      setToken(newToken);
      setAdmin(adminData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Admin logout
  const logout = () => {
    clearAdminSession();
  };

  // Clear admin session
  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return isAuthenticated && admin?.role === "admin";
  };

  // Get auth headers
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const value = {
    admin,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    getAuthHeaders,
    verifyToken,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook to use admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  
  return context;
}
