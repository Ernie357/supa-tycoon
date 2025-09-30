"use client";
import { createClient } from "@/lib/supabase/client";
import { RoomContext } from "./RoomContext";
import { ClientPlayer, RoomState } from "@/lib/types";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        const handleLeave = () => {
            navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomCode }));
        }

        window.addEventListener('beforeunload', handleLeave);

        return () => {
            window.removeEventListener('beforeunload', handleLeave);
        }
    }, [roomCode]);

    return (
        <RoomContext.Provider value={roomState}>
            {children}
        </RoomContext.Provider>
    );
}