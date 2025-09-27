"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState } from "react";
import { createRoom } from "@/lib/actions";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { ActionState } from "@/lib/types";

export default function RoomCreateSetupForm() {
    const action = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        formData.append("player-image", "morgana");
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
            <Checkbox id="is_public" name="is_public" />
            <Label htmlFor="is_public">Set Public?</Label>
            {!state.success && <p>{state.message}</p>}
        </form>
    );  
}