"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { GearItem, RentalOrder, OrderStatus } from "@/types/api";

// ---- Gear ----

export function useProviderGear() {
  return useQuery({
    queryKey: ["provider", "gear"],
    queryFn: () => apiClient<GearItem[]>("/provider/gear"),
  });
}

interface GearPayload {
  categoryId: string;
  name: string;
  brand?: string;
  description?: string;
  pricePerDay: number;
  stock: number;
  images?: string[];
}

export function useCreateGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GearPayload) =>
      apiClient<GearItem>("/provider/gear", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Gear added to your inventory");
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateGear(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GearPayload> & { isAvailable?: boolean }) =>
      apiClient<GearItem>(`/provider/gear/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Gear updated");
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
      queryClient.invalidateQueries({ queryKey: ["gear", "detail", id] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/provider/gear/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Gear removed");
      queryClient.invalidateQueries({ queryKey: ["provider", "gear"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

// ---- Orders ----

export function useProviderOrders() {
  return useQuery({
    queryKey: ["provider", "orders"],
    queryFn: () => apiClient<RentalOrder[]>("/provider/orders"),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) =>
      apiClient<RentalOrder>(`/provider/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["provider", "orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
