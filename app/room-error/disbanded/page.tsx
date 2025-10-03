import RoomError from "@/components/room/RoomError";

export default async function RoomNotFoundPage() {
    return (
        <RoomError errorMessage={`The room has been disbanded.`} />
    );
}