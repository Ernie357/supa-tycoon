"use client";
import { useActionState, useContext } from "react";
import { Button } from "../ui/button";
import { startGame } from "@/lib/actions";
import { RoomContext } from "@/context/RoomContext";
import { ActionState } from "@/lib/types";

export default function StartGameButton() {
    const room = useContext(RoomContext);
    const action = async (prevState: ActionState): Promise<ActionState> => {
        const result = await startGame(room.roomCode, prevState);
        return result;
    }
    const [state, formAction, isPending] = useActionState(action, { success: true });
    if(room.players.length < 4) {
        return null;
    }

    return (
        <form action={formAction} className="mt-5">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Starting...' : 'Start Game'}
            </Button>
            {!state.success && <p>{state.message}</p>}
        </form>
    );
}