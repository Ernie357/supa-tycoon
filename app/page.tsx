import RoomList from "@/components/RoomList";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function LandingPage() {
	const supabase = createAdminClient();
	const rooms = (await supabase.from("rooms").select('*').eq("is_public", true));
	// const { data: cards } = await supabase.from("cards").select();
	// const { data: { publicUrl: imageUrl } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/cards/Card04SideA_Clubs_of_Aces.jpg');
	// console.log(await supabase.from("players").select(SelectAll.Players));

	return (
		<>
			<h1>Hello!</h1>
			<RoomList rooms={rooms.data} />
		</>
	);
}
