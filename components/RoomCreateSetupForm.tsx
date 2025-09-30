"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState, useState } from "react";
import { createRoom } from "@/lib/actions";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ActionState } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import SpriteSelect from "./SpriteSelect";

export default function RoomCreateSetupForm() {
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
        formData.append("player-image", `${prefix}${options[optionsIdx]}`);
        const result = await createRoom(prevState, formData);
        return result;
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
                {isPending ? 'Creating...' : 'Create!!'}
            </Button>
            <SpriteSelect 
                options={options} 
                prefix={prefix}
                optionsIdx={optionsIdx}
                setOptionsIdx={setOptionsIdx}  
            />
            <Checkbox id="is_public" name="is_public" />
            <Label htmlFor="is_public">Set Public?</Label>
            {!state.success && <p>{state.message}</p>}
        </form>
    );  
}