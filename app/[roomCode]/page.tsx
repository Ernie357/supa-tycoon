import LeaveRoom from "@/components/room/LeaveRoom";
import PlayerList from "@/components/room/PlayerList";
import RoomContextProvider from "@/context/RoomContextProvider";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientPlayer, RoomState, SelectAll } from "@/lib/types";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;
    const supabase = createAdminClient();
    const initPlayers = (await supabase.from("players").select(SelectAll.Players).eq("room_code", roomCode)).data;
    const initState: RoomState = {
        roomCode: roomCode,
        roomHost: '',
        players: initPlayers ? initPlayers : [],
        messages: []
    };

    return (
        <RoomContextProvider roomCode={roomCode} init={initState}>
            <p className="text-2xl">Welcome to room {roomCode}</p>
            <LeaveRoom />
            <PlayerList />
        </RoomContextProvider>
    );
}