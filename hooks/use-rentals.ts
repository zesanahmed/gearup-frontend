"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { RentalOrder } from "@/types/api";

export function useMyOrders() {
  return useQuery({
    queryKey: ["rentals", "mine"],
    queryFn: () => apiClient<RentalOrder[]>("/rentals"),
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ["rentals", "detail", id],
    queryFn: () => apiClient<RentalOrder>(`/rentals/${id}`),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      apiClient<RentalOrder>(`/rentals/${orderId}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
