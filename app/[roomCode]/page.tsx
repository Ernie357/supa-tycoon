import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;
    const supabase = await createClient();
    const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
    if(!matchingRooms.data || matchingRooms.data.length === 0) {
        const error = new URLSearchParams(`Room ${roomCode} does not exist.`).toString().replace('=', '');
        redirect(`/?e=${error}`);
    }

    return (
        <>
            <p>Welcome to room {roomCode}</p>
        </>
    )
}