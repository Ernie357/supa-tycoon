import { Database } from "@/database.types";

// for error logging purposes only
export enum ErrorStatus {
    Cookie = "Cookie Error",
    RoomCreate = "Room Creation Error",
    RoomJoin = "Room Join Error",
    PGInsert = "Supabase Insert Error",
    PGDelete = "Supabase Delete Error",
    RoomLeave = "Room Leave Error"
};

// for client feedback purposes only
export enum ClientError {
    General = "Internal Server Error. Please try again.",
    RoomCreate = "There was an error creating a room.",
    RoomJoin = "There was an error joining the room.",
    RoomLeave = "There was an erro leaving the room.",
    Cookie = "There was an error creating the room session.",
};

export enum ClientSuccess {
    RoomCreate = "Successfully Created Room."
};

export enum SelectAll {
    Players = "name, image_url, joined_at, score, rank, room_code"
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
export type DatabaseActiveCards = DatabaseTables["active_cards"];


// Client Side Data

export type ClientPlayer = {
    name: string;
    imageUrl: string;
    rank: string | null;
    score: number | null;
};

export type ClientRoomMessage = {
    sentAt: string;
    sender: string;
    content: string;
    type: string;
};

export type RoomState = {
    roomCode: string;
    roomHost: string;
    players: ClientPlayer[];
    messages: ClientRoomMessage[];
};