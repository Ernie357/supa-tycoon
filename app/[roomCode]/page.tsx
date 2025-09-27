import LeaveRoom from "@/components/room/LeaveRoom";
import RoomContextProvider from "@/context/RoomContextProvider";

export default async function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const roomCode = (await params).roomCode;

    return (
        <RoomContextProvider roomCode={roomCode} player={{
            name: "Johnny Tycoon",
            score: null,
            rank: null,
            imageUrl: "Johnny image_url"
        }}>
            <p className="text-2xl">Welcome to room {roomCode}</p>
            <LeaveRoom />
        </RoomContextProvider>
    );
}