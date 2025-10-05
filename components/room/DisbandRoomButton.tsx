"use client";
import { useActionState, useContext } from "react";
import { Button } from "../ui/button";
import { disbandRoom } from "@/lib/actions";
import { RoomContext } from "@/context/RoomContext";
import { ActionState } from "@/lib/types";

export default function DisbandRoomButton() {
    const room = useContext(RoomContext);
    const action = async (prevState: ActionState): Promise<ActionState> => {
        const result = await disbandRoom(room.roomCode, prevState);
        return result;
    }
    const [state, formAction, isPending] = useActionState(action, { success: true });

    return (
        <form action={formAction}>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Disbanding...' : 'Disband Room'}
            </Button>
            {!state.success && <p>{state.message}</p>}
        </form>
    );
}