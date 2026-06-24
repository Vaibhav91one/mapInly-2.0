// @ts-nocheck — mock supabase client returns same shape, remove when real env vars added
"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export function initAuthStore() {
  const supabase = createClient();
  useAuthStore.getState().setLoading(true);

  supabase.auth.getUser().then((result: { data: { user: User | null } }) => {
    const user = result.data.user;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event: unknown, session: unknown) => {
      useAuthStore.getState().setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}
