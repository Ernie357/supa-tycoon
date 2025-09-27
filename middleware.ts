import { checkCookies, sendUserCookie, supabaseInsert, supabaseUpsert } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.next();
    }
    if(pathname.match(/^\/.+$/)) {
        if(pathname !== '/create-room' && pathname !== '/join-room') {
            url.pathname = '/';
            return NextResponse.redirect(url);
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
