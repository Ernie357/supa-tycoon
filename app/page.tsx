import RoomList from "@/components/RoomList";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function LandingPage() {
	const supabase = await createAdminClient();
	const rooms = (await supabase.from("rooms").select('*').eq("is_public", true));

	return (
		<main className="flex flex-col gap-10">
			<RoomList rooms={rooms.data} />
			<Link href="/create-room"><Button>Create a Room</Button></Link>
		</main>
	);
}
