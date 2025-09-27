import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Persona Tycoon",
    description: `Online Tycoon card game based on the style and gameplay 
    featured in Persona 5 Royal by Atlus and Sega.`,
};

const p5Font = localFont({
    src: './p5hatty_(Persona_5_Font).ttf'
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${p5Font.className} antialiased p-5 bg-[#d92323]`}>
                {children}
            </body>
        </html>
    );
}
