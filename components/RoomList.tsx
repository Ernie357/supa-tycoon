"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkCookie, clearCookie, createRoom } from "@/lib/actions";
import { DatabaseRooms } from "@/lib/types";

export default function RoomList({ rooms }: { rooms: DatabaseRooms["Row"][] | null }) {
    const [roomsList, setRoomsList] = useState<DatabaseRooms["Row"][] | null>(rooms);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('rooms')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'rooms' },
                (payload) => { setRoomsList(prev => !prev ? [payload.new as DatabaseRooms["Row"]] : [...prev, payload.new as DatabaseRooms["Row"]]) }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'rooms' },
                (payload) => { setRoomsList(prev => !prev ? null : prev.filter(room => room.code !== payload.old.code)) }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const roomElements = !roomsList ? <></> : roomsList.map(room => {
        return (
            <p key={room.code}>{room.code}</p>
        );
    });

    return (
        <section className="flex flex-col gap-5">
            <h1>Room List</h1>
            {roomElements}
            <div className="flex gap-5">
                <Button onClick={checkCookie}>Check Cookie</Button>
                <Button onClick={clearCookie}>Clear Cookie</Button>
            </div>
        </section>
    );
}