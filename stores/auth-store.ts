"use client";

import { create } from "zustand";
import { DEMO_USER_ID } from "@/lib/demo/data";

/** No login in the demo: everyone is the same pre-signed-in visitor. */
export type DemoAuthUser = { id: string };

interface AuthState {
  user: DemoAuthUser | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
  user: { id: DEMO_USER_ID },
  isLoading: false,
}));
