import { checkCookies } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    const supabase = createAdminClient();
    const { roomCode } = await req.json();
    const playerId = await checkCookies("playerId");
    await supabase.from("players").delete().eq("id", playerId!).eq("room_code", roomCode);
    return new Response("OK", { 
        status: 200,  
        headers: { 'Content-Type': 'application/json' }
    });
}