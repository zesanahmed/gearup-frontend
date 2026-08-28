"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { RentalOrder } from "@/types/api";

export function useCreateRentalOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: {
      items: { gearItemId: string; quantity: number }[];
      startDate: string;
      endDate: string;
    }) =>
      apiClient<RentalOrder>("/rentals", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (order) => {
      toast.success("Rental order placed! Waiting for provider confirmation.");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      router.push(`/dashboard/customer/orders/${order.id}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

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
