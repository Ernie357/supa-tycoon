"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState } from "react";
import { joinRoom } from "@/lib/actions";
import { ActionState } from "@/lib/types";

export default function RoomJoinSetupForm({ roomCode }: { roomCode: string }) {
    const action = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        formData.append("room-code", roomCode);
        formData.append("player-image", "morgana");
        const joinResult = await joinRoom(prevState, formData);
        return joinResult;
    }

    const [state, formAction, isPending] = useActionState(action, { success: true });

    return (
        <form className="text-2xl" action={formAction}>
            <Input 
                className="w-auto" 
                placeholder="name..."
                name={"player-name"}
            />
            <Button 
                type="submit" 
                className="text-2xl"
                disabled={isPending}
            >
                {isPending ? 'Joining...' : 'Join!!'}
            </Button>
            {!state.success && <p>{state.message}</p>}
        </form>
    );  
}