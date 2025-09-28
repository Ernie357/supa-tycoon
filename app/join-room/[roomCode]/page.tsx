import RoomJoinSetupForm from "@/components/RoomJoinSetupForm";

export default async function({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode

    return (
        <main>
            <RoomJoinSetupForm roomCode={roomCode} />
        </main>
    );
}