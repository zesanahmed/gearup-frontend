"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { GearItem, Category } from "@/types/api";

export interface GearFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface GearListResponse {
  items: GearItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildQueryString(filters: GearFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useGearList(filters: GearFilters = {}) {
  return useQuery({
    queryKey: ["gear", filters],
    queryFn: () =>
      apiClient<GearListResponse>(`/gear${buildQueryString(filters)}`),
  });
}

export function useGearDetail(id: string) {
  return useQuery({
    queryKey: ["gear", "detail", id],
    queryFn: () => apiClient<GearItem>(`/gear/${id}`),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient<Category[]>("/categories"),
    staleTime: 5 * 60 * 1000, // category কম পরিবর্তন হয়, ৫ মিনিট cache
  });
}
