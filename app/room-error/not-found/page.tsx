import RoomError from "@/components/room/RoomError";

export default async function RoomNotFoundPage() {
    return (
        <RoomError errorMessage={`This room no longer exists.`} />
    );
}