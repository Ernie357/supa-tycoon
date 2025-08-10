import { createClient } from "@/lib/supabase/client";

export default function RoomList() {
    const supabase = createClient();
    supabase.channel('rooms').on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'rooms' },
        (payload) => { console.log(payload) }
    ).subscribe();

    return (
        <section>
            <h1>Room List</h1>
        </section>
    );
}