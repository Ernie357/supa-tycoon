import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function RoomError({ errorMessage }: { errorMessage?: string }) {
    const supabase = await createClient();
    const { data: { publicUrl: morganaSad } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/avatars/morgana/sad.png');

    return (
        <section className="flex text-3xl">
            <Image 
                src={morganaSad} 
                width={200} 
                height={200} 
                alt="Morgana Sad Portrait" 
            />
            <div className="flex flex-col items-center justify-center">
                <p>{errorMessage ? errorMessage : 'Error connecting to room.'}</p>
                <Link href={'/'}><u>Return to Homepage</u></Link>
            </div>
        </section>
    );
}