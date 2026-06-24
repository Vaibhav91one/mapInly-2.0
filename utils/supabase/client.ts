import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // ponytail: return mock when Supabase not configured
  if (!url || !key) {
    return {
      auth: {
        getUser: async (): Promise<{ data: { user: User | null }; error: null }> => ({
          data: { user: null },
          error: null,
        }),
        signInWithOAuth: async (): Promise<{ data: null; error: null }> => ({
          data: null,
          error: null,
        }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
    } as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
