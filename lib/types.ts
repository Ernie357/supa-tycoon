export enum ErrorStatus {
    Cookie = "Cookie Error",
    RoomCreate = "Room Creation Error",
    RoomJoin = "Room Join Error",
};

export enum ClientError {
    General = "Internal Server Error. Please try again.",
    RoomCreate = "There was an error creating a room.",
    RoomJoin = "There was an error joining the room.",
    Cookie = "There was an error creating the room session."
};

export type StructuredError = {
    success: false;
    clientMessage: string;
};