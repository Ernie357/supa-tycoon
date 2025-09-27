"use client";

import { removePlayerFromRoom } from "@/lib/actions";
import { useActionState } from "react";

export default function LeaveRoom() {
    const [state, action, isPending] = useActionState(removePlayerFromRoom, { success: true });

    return (
        <form action={action}>
            <button 
                type="submit"
                disabled={isPending}
            >
                Leave Room
            </button>
            {!state.success && state.message && <p>{state.message}</p>}
        </form>
    );
}