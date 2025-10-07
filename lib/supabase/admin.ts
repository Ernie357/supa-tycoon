import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// this client bypasses RLS and can only be used server side
export async function createAdminClient() {
    const cookieStore = await cookies();
    const playerId = cookieStore.get('playerId');
    const customHeader = playerId === undefined ? '' : playerId.value; 
    
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            },
            global: {
                headers: {
                    // Pass custom data via headers for custom RLS
                    'x-user-id': customHeader,
                }
            }
        },
    );
}