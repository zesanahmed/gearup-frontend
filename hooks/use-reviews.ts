"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { Review } from "@/types/api";

export function useCreateReview(gearItemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; comment?: string }) =>
      apiClient<Review>("/reviews", {
        method: "POST",
        body: JSON.stringify({ gearItemId, ...payload }),
      }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      queryClient.invalidateQueries({
        queryKey: ["gear", "detail", gearItemId],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
