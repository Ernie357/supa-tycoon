"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActionState } from "react";
import { createRoom } from "@/lib/actions";

// export default function RoomJoinSetupForm() {
//     const [state, formAction, isPending] = useActionState(createRoom, { success: true });

//     return (
//         <form className="text-2xl" action={formAction}>
//             <Input className="w-auto" />
//             <Button 
//                 type="submit" 
//                 className="text-2xl"
//                 disabled={isPending}
//             >
//                 {isPending ? 'Joining...' : 'Join!!'}
//             </Button>
            
//         </form>
//     );  
// }