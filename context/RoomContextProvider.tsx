"use client";
import { createClient } from "@/lib/supabase/client";
import { RoomContext } from "./RoomContext";
import { ClientPlayer, RoomState } from "@/lib/types";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
    roomCode: string;
    init: RoomState;
};

export default function RoomContextProvider({ children, roomCode, init }: Props) {
    const [roomState, setRoomState] = useState<RoomState>(init);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
        .channel("rooms")
        .on(
            'postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'players' },
            (payload) => {
                console.log(payload);
                const newPlayer = payload.new as ClientPlayer;
                setRoomState(prev => {
                    return { ...prev, players: [...prev.players, newPlayer] };
                }); 
            }
        )
        .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'players' },
            (payload) => {
                console.log(payload);
                const deletedPlayerId = payload.old.public_id as string;
                setRoomState(prev => {
                    return { 
                        ...prev, 
                        players: prev.players.filter(p => p.public_id !== deletedPlayerId) 
                    }
                });
            }
        )
        .subscribe();
        const handleLeave = () => {
            navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomCode }));
        }
        window.addEventListener('beforeunload', handleLeave);
        return () => {
            window.removeEventListener('beforeunload', handleLeave);
            fetch('/api/leave-room', {
                method: 'POST',
                body: JSON.stringify({ roomCode }),
                headers: { 'Content-Type': 'application/json' },
                keepalive: true,
            });
            supabase.removeChannel(channel);
        }
    }, [roomCode]);

    return (
        <RoomContext.Provider value={roomState}>
            {children}
        </RoomContext.Provider>
    );
}