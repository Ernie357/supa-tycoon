import { createClient } from "@/lib/supabase/client";
import { RoomState, SelectAll } from "@/lib/types";

export default function getInitialRoomState(roomCode: string): RoomState {
    const supabase = createClient();
    supabase.from("players").select(SelectAll.Players).eq("room_code", roomCode)
        .then(data => {
            console.log(data);
        });
    return {
        roomCode: roomCode,
        roomHost: '',
        players: [],
        messages: []
    };
}