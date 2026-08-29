"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { User, GearItem, RentalOrder } from "@/types/api";

export function useAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => apiClient<User[]>("/admin/users"),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "ACTIVE" | "SUSPENDED";
    }) =>
      apiClient<User>(`/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: (user) => {
      toast.success(
        `${user.name} is now ${user.status === "ACTIVE" ? "active" : "suspended"}`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAllGearAdmin() {
  return useQuery({
    queryKey: ["admin", "gear"],
    queryFn: () => apiClient<GearItem[]>("/admin/gear"),
  });
}

export function useAllRentalsAdmin() {
  return useQuery({
    queryKey: ["admin", "rentals"],
    queryFn: () => apiClient<RentalOrder[]>("/admin/rentals"),
  });
}
