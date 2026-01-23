import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Database features will be disabled until configured.");
}

/**
 * Standard Supabase client for client-side usage.
 * Uses @supabase/ssr to ensure session syncing with server-side middleware via cookies.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);