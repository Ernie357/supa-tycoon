import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
	const supabase = await createClient();
	const { data } = await supabase.from("cards").select();

	return (
		<>
			<h1>Hello!</h1>
			<h1>{JSON.stringify(data)}</h1>
		</>
	);
}