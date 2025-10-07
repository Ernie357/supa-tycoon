import DisbandRoomButton from "@/components/room/DisbandRoomButton";
import LeaveRoom from "@/components/room/LeaveRoom";
import PlayerList from "@/components/room/PlayerList";
import StartGameButton from "@/components/room/StartGameButton";
import RoomContextProvider from "@/context/RoomContextProvider";
import { checkCookies } from "@/lib/actionOps";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClientPlayer, ErrorStatus, RoomState, SelectAll } from "@/lib/types";
import { logError } from "@/lib/utils";
import { redirect } from "next/navigation";

interface WithId extends ClientPlayer {
    id: string;
}

function stripId(player: WithId): ClientPlayer  {
    return (({ id, ...rest }) => { return rest })(player);
}

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;
    const supabase = await createAdminClient();
    const initPlayers = await supabase.from("players").select(`${SelectAll.Players}, id, is_host`).eq("room_code", roomCode);
    if(initPlayers.error) {
        logError(ErrorStatus.PGSelect, initPlayers.error.details);
        redirect('room-error');
    }
    if(!initPlayers.data || !roomCode) {
        logError(ErrorStatus.RoomConnection, "No pg player data / no roomCode on page load.");
        redirect('room-error');
    }
    const initState: RoomState = {
        roomCode: roomCode,
        roomHost: stripId(initPlayers.data.find(p => p.is_host)!),
        players: initPlayers.data.map(p => stripId(p)),
        messages: []
    };
    const playerId = await checkCookies('playerId');
    if(!playerId) {
        logError(ErrorStatus.RoomConnection, "No playerId cookie on page load.");
        redirect('room-error');
    }
    const initPlayer = initPlayers.data.find(p => p.id === playerId);
    if(!initPlayer) {
        console.log('no init player on page load.');
        redirect('room-error');
    }
    const player = stripId(initPlayer);

    return (
        <RoomContextProvider roomCode={roomCode} init={initState} player={player}>
            <p className="text-2xl">Welcome to room {roomCode}</p>
            <LeaveRoom />
            <PlayerList />
            { player.is_host && <DisbandRoomButton /> }
            { player.is_host && <StartGameButton /> }
        </RoomContextProvider>
    );
}