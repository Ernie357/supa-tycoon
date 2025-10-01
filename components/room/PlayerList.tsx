"use client";
import { RoomContext } from "@/context/RoomContext";
import Image from "next/image";
import { useContext } from "react";

export default function PlayerList() {
    const roomContext = useContext(RoomContext);
    const playerElements = roomContext.players.map(player => {
        return (
            <div key={player.name} className="border-black border-2 p-3 m-5">
                <ul>
                    <Image 
                        src={player.image_url} 
                        alt={`${player.name} image`}
                        width={100}
                        height={100} 
                    />
                    <li>Name: {player.name}</li>
                    <li>Rank: {player.rank}</li>
                    <li>Score {player.score}</li>
                </ul>
            </div>
        );
    });

    return (
        <section className="flex gap-20">
            {playerElements}
        </section>
    );
}