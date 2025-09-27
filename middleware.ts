import { checkCookies, sendUserCookie, supabaseInsert, supabaseUpsert } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = request.nextUrl.pathname;
    if(pathname.match(/^\/[a-zA-Z0-9]+$/)) { // room code
        const roomCode = pathname.replace('/', '');
        const supabase = createAdminClient();
        const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
        if(!matchingRooms.data || matchingRooms.data.length === 0) {
            url.pathname = `/room-error/not-found/${roomCode}`;
            return NextResponse.redirect(url);
        }
        const existingCookie = await checkCookies('playerId');
        if(!existingCookie) {
            const cookieResult = await sendUserCookie();
            if(!cookieResult.success) {
                url.pathname = '/room-error';
                return NextResponse.redirect(url);
            }
            const playerInsertResult = await supabaseInsert("players", {
                id: cookieResult.playerId!,
                name: "Johnny Tycoon",
                room_code: roomCode,
                score: null,
                rank: null,
                image_url: "Johnny image_url"
            });
            if(!playerInsertResult.success) {
                url.pathname = '/room-error';
                return NextResponse.redirect(url);
            }
        } else {
            const playerInsertResult = await supabaseUpsert("players", {
                id: existingCookie,
                name: "Johnny Tycoon",
                room_code: roomCode,
                score: null,
                rank: null,
                image_url: "Johnny image_url"
            });
            if(!playerInsertResult.success) {
                url.pathname = '/room-error';
                return NextResponse.redirect(url);
            }
        }
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
