"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  RegisterFormValues,
  LoginFormValues,
} from "@/lib/validations/auth";
import type { ApiResponse, User } from "@/types/api";

interface AuthData {
  user: User;
  token: string;
}

async function postAuth(path: string, body: unknown): Promise<AuthData> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<AuthData> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Something went wrong");
  }
  return json.data as AuthData;
}

function roleToDashboard(role: User["role"]): string {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/customer";
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      postAuth("/api/auth/register", values),
    onSuccess: (data) => {
      toast.success(`Welcome to GearUp, ${data.user.name}!`);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push(roleToDashboard(data.user.role));
      router.refresh(); // Server Component-গুলো নতুন session অনুযায়ী re-render হবে
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogin(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      postAuth("/api/auth/login", values),
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.user.name}!`);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push(redirectTo || roleToDashboard(data.user.role));
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
}
