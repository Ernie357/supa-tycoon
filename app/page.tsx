"use client";
import RoomList from "@/components/RoomList";
import { Button } from "@/components/ui/button";
import { checkCookie, clearCookie, createRoom } from "@/lib/actions";

export default function LandingPage() {
	// const { data: cards } = await supabase.from("cards").select();
	// const { data: { publicUrl: imageUrl } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/cards/Card04SideA_Clubs_of_Aces.jpg');
	return (
		<>
			<h1>Hello!</h1>
			<div className="flex gap-5">
				<Button onClick={createRoom}>Add Room</Button>
				<Button onClick={checkCookie}>Check Cookie</Button>
				<Button onClick={clearCookie}>Clear Cookie</Button>
			</div>
			<RoomList />
		</>
	);
}
