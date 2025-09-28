import { checkCookies } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

// todo: consolidate multiple PG calls into one supabase function
export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = request.nextUrl.pathname;
    if(pathname.match(/^\/[a-zA-Z0-9]{8}$/)) { // room code
        const roomCode = pathname.replace('/', '');
        const supabase = createAdminClient();
        const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
        if(!matchingRooms.data || matchingRooms.data.length === 0) {
            url.pathname = `/room-error/not-found/${roomCode}`;
            return NextResponse.redirect(url);
        }
        const existingCookie = await checkCookies('playerId');
        if(!existingCookie) {
            url.pathname = `/join-room/${roomCode}`;
            return NextResponse.redirect(url);
        }
        const matchingPlayers = (await supabase.from("players").select("*").eq("id", existingCookie).eq("room_code", roomCode));
        const playerExists = matchingPlayers.data !== null && matchingPlayers.data.length > 0;
        if(!playerExists) {
            url.pathname = `/join-room/${roomCode}`;
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
    if(pathname.match(/^\/join\-room\/[a-zA-Z0-9]{8}$/)) {
        const roomCode = pathname.replaceAll('/', '').replace('join-room', '');
        const supabase = createAdminClient();
        const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
        if(!matchingRooms.data || matchingRooms.data.length === 0) {
            url.pathname = `/room-error/not-found/${roomCode}`;
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
