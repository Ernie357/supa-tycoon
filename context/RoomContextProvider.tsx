"use client";
import { createClient } from "@/lib/supabase/client";
import { RoomContext } from "./RoomContext";
import { ClientPlayer, RoomState } from "@/lib/types";
import { useState } from "react";
import getInitialRoomState from "./getInitialRoomState";

type Props = {
    children: React.ReactNode;
    roomCode: string;
    player: ClientPlayer
};

export default function RoomContextProvider({ children, roomCode, player }: Props) {
    const initialState = getInitialRoomState(roomCode);
    const [roomState, setRoomState] = useState<RoomState>(initialState);
    const supabase = createClient();
    supabase.channel("rooms")
    .on(
        "postgres_changes", 
        { event: 'INSERT', schema: 'public', table: 'players' },
        (payload) => {console.log(payload)}
    );
    const presence = supabase
        .channel(`room:${roomCode}`)
        .on("presence", { event: 'leave' }, ({ leftPresences }) => {
            console.log(leftPresences);
        })
        .subscribe(async (status, err) => {
            if(status !== 'SUBSCRIBED') { return; }
            const presenceTrackStatus = await presence.track(player);
            console.log('Presence: ' + presenceTrackStatus);
        });
    return (
        <RoomContext.Provider value={roomState}>
            {children}
        </RoomContext.Provider>
    );
}