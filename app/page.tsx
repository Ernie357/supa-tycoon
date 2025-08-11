import RoomList from "@/components/RoomList";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
	const supabase = await createClient();
	const rooms = (await supabase.from("rooms").select('*')).data;
	// const { data: cards } = await supabase.from("cards").select();
	// const { data: { publicUrl: imageUrl } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/cards/Card04SideA_Clubs_of_Aces.jpg');

	return (
		<>
			<h1>Hello!</h1>
			<RoomList rooms={rooms} />
		</>
	);
}
