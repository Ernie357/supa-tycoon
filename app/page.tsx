import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function LandingPage() {
	const supabase = await createClient();
	const { data: cards } = await supabase.from("cards").select();
	const { data: { publicUrl: imageUrl } } = supabase.storage.from('persona-tycoon-assets').getPublicUrl('p5/images/cards/Card00SideB(Version1)_Back_Original.jpg');

	return (
		<>
			<h1>Hello!</h1>
			<h1>{JSON.stringify(cards)}</h1>
			<h1>Image Url: {imageUrl}</h1>
			<Button>Shad Button</Button>
			<Image src={imageUrl} alt="card" width={200} height={200} />
		</>
	);
}