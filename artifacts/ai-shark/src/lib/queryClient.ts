import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { customFetch, ApiError } from "@workspace/api-client-react";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  headers?: HeadersInit,
): Promise<Response> {
  const res = await customFetch<Response>(url, {
    responseType: "response",
    method,
    headers: { ...(data ? { "Content-Type": "application/json" } : {}), ...headers },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T | null> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      return await customFetch(queryKey.join("/") as string);
    } catch (error) {
      if (unauthorizedBehavior === "returnNull" && error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
