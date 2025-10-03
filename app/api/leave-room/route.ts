import { checkCookies } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createAdminClient();
    const { roomCode } = await req.json();
    const playerId = await checkCookies("playerId");
    await supabase.from("players").delete().eq("id", playerId!).eq("room_code", roomCode);
    const url = new URL(req.url);
    url.pathname = '/';
    console.log('redirecting to ' + url.href);
    return NextResponse.redirect(url.href);
}