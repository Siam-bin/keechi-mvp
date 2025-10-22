// src/app/providers.js
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
