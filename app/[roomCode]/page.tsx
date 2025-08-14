import RoomError from "@/components/room/RoomError";
import { checkCookies, sendUserCookie, supabaseInsert } from "@/lib/actionOps";
import { createClient } from "@/lib/supabase/server";
import { ClientError, DatabaseActiveCards, DatabasePlayers } from "@/lib/types";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;
    const supabase = await createClient();
    const matchingRooms = await supabase.from("rooms").select("*").eq("code", roomCode);
    if(!matchingRooms.data || matchingRooms.data.length === 0) {
        return <RoomError errorMessage={`Room ${roomCode} does not exist.`} />;
    }
    const playerId = await checkCookies("playerId");
    if(playerId === null) {
        const cookieResult = await sendUserCookie();
        if(!cookieResult.success) {
            return <RoomError errorMessage={cookieResult.message} />;
        }
        const playerInsertResult = await supabaseInsert<DatabasePlayers["Insert"]>("players", {
            id: cookieResult.playerId,
            name: "Johnny Tycoon",
            room_code: roomCode,
            score: null,
            rank: null,
            image_url: "Johnny image_url"
        });
        if(!playerInsertResult.success) {
            return <RoomError errorMessage={ClientError.RoomJoin} />;
        }
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