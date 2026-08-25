import { ApiResponse } from "../types/api";

export class ApiClientError extends Error {
  errorDetails?: unknown;
  status: number;

  constructor(message: string, status: number, errorDetails?: unknown) {
    super(message);
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiClientError(
      json.message || "Something went wrong",
      res.status,
      json.errorDetails,
    );
  }

  return json.data as T;
}
