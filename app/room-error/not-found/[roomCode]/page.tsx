import RoomError from "@/components/room/RoomError";

export default async function RoomNotFoundPage({ params }: { params: Promise<{roomCode: string}> }) {
    const roomCode = (await params).roomCode;

    return (
        <RoomError errorMessage={`Room ${roomCode} does not exist.`} />
    );
}