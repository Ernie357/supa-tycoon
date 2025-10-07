"use client";
import { RoomContext } from "@/context/RoomContext";
import { useActionState, useContext } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ActionState } from "@/lib/types";
import { sendMessage } from "@/lib/actions";

export default function ChatPanel() {
    const room = useContext(RoomContext);

    const action = async (prev: ActionState, formData: FormData ): Promise<ActionState> => {
        formData.append("room-code", room.roomCode);
        formData.append("player-name", room.player.name);
        const result = await sendMessage(formData, prev);
        return result;
    }

    const [state, formAction, isPending] = useActionState(action, { success: true });

    const messageElements = room.messages.map(message => {
        return (
            <div className="flex gap-10 border-2 border-black" key={message.sentAt}>
                <p>{message.sender}: </p>
                <p>{message.content}</p>
            </div>
        );
    });

    return (
        <section className="flex flex-col gap-5 border-2 border-black">
            {messageElements}
            <form className="flex gap-5 items-center" action={formAction}>
                <Input 
                    placeholder="Enter Message"
                    name="player-message"
                    type="text"
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send'}
                </Button>
                {!state.success && <p>{state.message}</p>}
            </form>
        </section>
    );
}