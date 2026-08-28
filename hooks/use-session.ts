"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/api";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => apiClient<User>("/auth/me"),
    retry: false, // ৪০১ পেলে বার বার retry করার দরকার নেই, মানে সহজভাবে "logged out"
    staleTime: 5 * 60 * 1000,
  });
}
