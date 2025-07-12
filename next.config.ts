import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		// adds supabase bucket public URL to next/image allow list
		remotePatterns: [new URL('https://xbllebgkcodidhkjgadz.supabase.co/**')],
	},
};

export default nextConfig;
