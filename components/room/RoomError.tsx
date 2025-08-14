import Link from "next/link";

export default async function RoomError({ errorMessage }: { errorMessage?: string }) {
    return (
        <>
            <p>{errorMessage ? errorMessage : 'Error connecting to room.'}</p>
            <Link href={'/'}>Return to Homepage</Link>
        </>
    );
}