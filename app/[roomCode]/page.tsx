import ChatPanel from "@/components/room/ChatPanel";
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
    const initDatabaseState = await supabase.rpc("get_room_data", { room_code_param: roomCode });
    if(initDatabaseState.error) {
        logError(ErrorStatus.PGSelect, JSON.stringify(initDatabaseState.error));
        redirect('room-error');
    }
    const playerId = await checkCookies('playerId');
    if(!playerId) {
        logError(ErrorStatus.RoomConnection, "No playerId cookie on page load.");
        redirect('room-error');
    }
    const players: ClientPlayer[] = initDatabaseState.data.players;
    const player = players.find((p: any) => p.id === playerId);
    const hostPlayer = players.find((p: any) => p.is_host === true);
    if(!player || !hostPlayer) {
        logError(ErrorStatus.RoomConnection, "Could not find host or player.");
        redirect('room-error');
    }
    const initState: RoomState = {
        roomCode: roomCode,
        roomHost: hostPlayer,
        players: players,
        messages: initDatabaseState.data.messages ? initDatabaseState.data.messages : [],
        player: player
    };

    return (
        <RoomContextProvider roomCode={roomCode} init={initState}>
            <p className="text-2xl">Welcome to room {roomCode}</p>
            <LeaveRoom />
            <PlayerList />
            {/* { player.is_host && <DisbandRoomButton /> }
            { player.is_host && <StartGameButton /> } */}
            <ChatPanel />
        </RoomContextProvider>
    );
}