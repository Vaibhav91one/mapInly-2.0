"use client";

import { useEffect } from "react";
import { initAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return initAuthStore();
  }, []);
  return <>{children}</>;
}
