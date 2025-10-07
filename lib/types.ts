import { Database } from "@/database.types";

// for error logging purposes only
export enum ErrorStatus {
    Cookie = "Cookie Error",
    RoomCreate = "Room Creation Error",
    RoomJoin = "Room Join Error",
    PGInsert = "Supabase Insert Error",
    PGUpsert = "Supabase Upsert Error",
    PGSelect = "Supabase Select Error",
    PGDelete = "Supabase Delete Error",
    RoomLeave = "Room Leave Error",
    RoomConnection = "General Room Connection Error",
    RoomDisband = "Room Disband Error",
    GameStart = "Start Game Error",
    MessageSend = "Player Message Send Error"
};

// for client feedback purposes only
export enum ClientError {
    General = "Internal Server Error. Please try again.",
    RoomCreate = "There was an error creating a room.",
    RoomJoin = "There was an error joining the room.",
    RoomLeave = "There was an error leaving the room.",
    RoomDisband = "There was an error disbanding the room",
    Cookie = "There was an error creating the room session.",
    GameStart = "There was an error starting the game.",
    MessageSend = "Error sending message."
};

export enum ClientSuccess {
    RoomCreate = "Successfully Created Room."
};

export enum SelectAll {
    Players = "public_id, name, image_url, score, rank"
};

// specifics is NOT error details (like what went wrong in code)
// specifics should be an object with specific client messages
// example: { firstName: "Input cannot be empty.", lastName: "Too long." }
// error details should only be logged server side
export type StructuredError<S = undefined> = {
    success: false;
    message?: ClientError;
    specifics?: S; 
};

export type ActionSuccess<D = undefined> = {
    success: true;
    message?: ClientSuccess; 
    data?: D;
};

export type ActionState = ActionSuccess | StructuredError;

// Database Aliases

export type DatabasePublic = Database["public"];
export type DatabaseTables = DatabasePublic["Tables"];
export type DatabaseRooms = DatabaseTables["rooms"];
export type DatabasePlayers = DatabaseTables["players"];
//export type DatabaseActiveCards = DatabaseTables["active_cards"];


// Client Side Data

export type ClientPlayer = {
    public_id: string;
    name: string;
    image_url: string;
    rank: string | null;
    score: number | null;
    is_host: boolean;
};

export type ClientRoomMessage = {
    sentAt: string;
    sender: string;
    content: string;
    type: string;
};

export type RoomState = {
    roomCode: string;
    roomHost: ClientPlayer;
    players: ClientPlayer[];
    messages: ClientRoomMessage[];
    player: ClientPlayer;
};