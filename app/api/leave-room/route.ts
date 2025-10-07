import { checkCookies } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    const supabase = await createAdminClient();
    const { roomCode } = await req.json();
    const playerId = await checkCookies("playerId");
    await supabase.from("players").delete().eq("id", playerId!).eq("room_code", roomCode);
    // const url = new URL(req.url);
    // url.pathname = '/';
    // console.log('redirecting to ' + url.href);
    return new Response("OK", { 
        status: 200,  
        headers: { 'Content-Type': 'application/json' }
    });
}