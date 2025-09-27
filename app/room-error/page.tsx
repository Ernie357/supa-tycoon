import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function RoomError({ errorMessage }: { errorMessage?: string }) {
    const supabase = await createClient();
    const { data: { publicUrl: morganaSad } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/avatars/morgana/sad.png');

    return (
        <>
            <Image 
                src={morganaSad} 
                width={100} 
                height={100} 
                alt="Morgana Sad Portrait" 
            />
            <p>{errorMessage ? errorMessage : 'Error connecting to room.'}</p>
            <Link href={'/'}>Return to Homepage</Link>
        </>
    );
}