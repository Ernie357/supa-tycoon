// for error logging purposes only
export enum ErrorStatus {
    Cookie = "Cookie Error",
    RoomCreate = "Room Creation Error",
    RoomJoin = "Room Join Error",
    PGInsert = "Supabase Insert Error"
};

// for client feedback purposes only
export enum ClientError {
    General = "Internal Server Error. Please try again.",
    RoomCreate = "There was an error creating a room.",
    RoomJoin = "There was an error joining the room.",
    Cookie = "There was an error creating the room session."
};

export enum ClientSuccess {
    RoomCreate = "Successfully Created Room."
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

export type ActionSuccess = {
    success: true;
    message?: ClientSuccess; 
};