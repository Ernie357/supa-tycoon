"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState, useState } from "react";
import { joinRoom } from "@/lib/actions";
import { ActionState } from "@/lib/types";
import SpriteSelect from "./SpriteSelect";
import { createClient } from "@/lib/supabase/client";

export default function RoomJoinSetupForm({ roomCode }: { roomCode: string }) {
    const supabase = createClient();
    const [optionsIdx, setOptionsIdx] = useState<number>(0);

    const options = [
        '/joker/neutral.png',
        '/morgana/neutral.png',
        '/ryuji/neutral.png',
        '/ann/neutral.png',
        '/yusuke/neutral.png',
        '/makoto/neutral.png',
        '/futaba/neutral.png',
        '/haru/neutral.png',
        '/akechi/neutral.png'
    ];
    const prefix = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/avatars').data.publicUrl;

    const action = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        formData.append("room-code", roomCode);
        formData.append("player-image", `${prefix}${options[optionsIdx]}`);
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
            <SpriteSelect 
                options={options} 
                prefix={prefix}
                optionsIdx={optionsIdx}
                setOptionsIdx={setOptionsIdx}  
            />
            {!state.success && <p>{state.message}</p>}
        </form>
    );  
}