export default function RoomErrorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex justify-center items-center w-full h-full">
            {children}
        </main>
    );
}