"use client";
import { RoomState } from "@/lib/types";
import { createContext } from "react";

const emptyRoomState: RoomState = { 
    roomCode: '', 
    roomHost: '', 
    players: [],  
    messages: []
}

export const RoomContext = createContext<RoomState>(emptyRoomState);