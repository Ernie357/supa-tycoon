import RoomList from "@/components/RoomList";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage({ searchParams }: { searchParams: Promise<{ e: string }> }) {
	const supabase = await createClient();
	const rooms = (await supabase.from("rooms").select('*')).data;
	const error = (await searchParams).e;
	// const { data: cards } = await supabase.from("cards").select();
	// const { data: { publicUrl: imageUrl } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/cards/Card04SideA_Clubs_of_Aces.jpg');

	return (
		<>
			<h1>Hello!</h1>
			<RoomList rooms={rooms} />
			{ error && <p className="color-red-500">{error}</p> }
		</>
	);
}
