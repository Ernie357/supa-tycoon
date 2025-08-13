import { createClient } from "@/lib/supabase/server";
import { DatabaseActiveCards } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;
    const supabase = await createClient();
    const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
    if(!matchingRooms.data || matchingRooms.data.length === 0) {
        const error = new URLSearchParams(`Room ${roomCode} does not exist.`).toString().replace('=', '');
        redirect(`/?e=${error}`);
    }
    // join on rooms/games to only get that specific one
    const playerCards: DatabaseActiveCards["Row"][] | null = 
        (await supabase.from("active_cards")
        .select("*"))
        .data;

    return (
        <>
            <p className="text-2xl">Welcome to room {roomCode}</p>
            <p>Cards: {JSON.stringify(playerCards)}</p>
        </>
    )
}