import { createClient } from '@supabase/supabase-js';

// this client bypasses RLS and can only be used server side
export function createAdminClient() { 
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        }
    );
}