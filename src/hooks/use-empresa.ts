"use client";

import { useSession } from "next-auth/react";

export function useEmpresa() {
  const { data: session, status } = useSession();

  return {
    empresa: session?.user || null,
    loading: status === "loading",
    error: null,
    isAuthenticated: status === "authenticated",
  };
}
