"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Payment } from "@/types/api";

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "mine"],
    queryFn: () => apiClient<Payment[]>("/payments"),
  });
}
