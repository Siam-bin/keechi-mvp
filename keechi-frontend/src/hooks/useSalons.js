// src/hooks/useSalons.js
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch all shops from the new shops endpoint
 * @param {string} area - Optional area filter (not yet implemented in shops API)
 * @returns {object} { data, isLoading, error, isPending, isError }
 */
export default function useSalons(area) {
  return useQuery({
    queryKey: ["shops", area],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/shops`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    enabled: true,
  });
}
