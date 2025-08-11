import { createBrowserClient } from "@supabase/ssr";

// this client is optimized for browser and sets auth cookies there
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	);
}