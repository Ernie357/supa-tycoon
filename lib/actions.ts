'use server';

import { ActionState, ActionSuccess, ClientError, ErrorStatus, StructuredError } from "@/lib/types";
import { logError } from "@/lib/utils";
import { checkCookies, handleInitPlayerConnection, sendUserCookie, supabaseInsert } from "./actionOps";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supabase/admin";

function generateRandomString(length: number): string {
    let result = "";
    let values = "abcdefghijklmnopqrstuvwxyz1234567890";
    for(let idx = 0; idx < length; idx++) {
        result += values[Math.floor(Math.random() * values.length)];
    }
    return result;
}

export async function createRoom( _: ActionState, formData: FormData): Promise<ActionState> {
    const playerName = formData.get("player-name")?.toString();
    const playerImage = formData.get("player-image")?.toString();
    const isPublic = formData.get("is_public") === "on";
    let roomCode: string;
    try {
        if(!playerName || !playerImage) {
            throw new Error("Missing player name or image for room create.");
        }
        roomCode = generateRandomString(8);
        const roomInsertResult = await supabaseInsert("rooms", {
            code: roomCode,
            is_public: isPublic
        });
        if(!roomInsertResult.success) {
            throw new Error("Room create failed due to PG room insert.");
        }
        const connectResult = await handleInitPlayerConnection(playerName, playerImage, roomCode, "create");
        if(!connectResult.success) {
            throw new Error("Room create failed due to player connection.");
        }
    } catch(e) {
        logError(ErrorStatus.RoomCreate, e);
        return { success: false, message: ClientError.RoomCreate };
    }
    // this internally throws err for some reason so must be outside try/catch
    redirect(`/${roomCode}`);
}

export async function joinRoom(_: ActionState, formData: FormData): Promise<ActionState> {
    const roomCode = formData.get("room-code")?.toString();
    const playerName = formData.get("player-name")?.toString();
    const playerImage = formData.get("player-image")?.toString();
    try {
        if(!roomCode || !playerName || !playerImage) {
            throw new Error(`Missing roomcode, name, or image for Room Join in room ${roomCode}`);
        }
        const connectResult = await handleInitPlayerConnection(playerName, playerImage, roomCode);
        if(!connectResult.success) {
            throw new Error(`Room Join failed for room ${roomCode} due to player connection.`);
        }
    } catch(e) {
        logError(ErrorStatus.RoomJoin, e);
        return { success: false, message: ClientError.RoomJoin };
    }
    redirect(`/${roomCode}`);
}

export async function disbandRoom(roomCode: string, _: ActionState): Promise<ActionState> {
    try {
        const playerId = await checkCookies("playerId");
        const supabase = await createAdminClient();
        const deleteResult = await supabase.rpc("disband_room", { player_id: playerId, room_code: roomCode });
        if(deleteResult.error) {
            throw new Error(JSON.stringify(deleteResult.error));
        }
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.RoomDisband, e);
        return { success: false, message: ClientError.RoomDisband };
    }
}

// this is for the explicit leave room button
// all other leaves should be handled by the api route
export async function removePlayerFromRoom(_: ActionState): Promise<ActionState> {
    try {
        const supabase = await createAdminClient();
        const playerId = await checkCookies('playerId');
        const playerDeleteResult = (await supabase.from("players").delete().eq("id", playerId).select('room_code'));
        if(playerDeleteResult.error) {
            throw new Error(playerDeleteResult.error.details);
        }
    } catch(e) {
        logError(ErrorStatus.RoomLeave, e);
        return { success: false, message: ClientError.RoomLeave };
    }
    redirect("/");
}

export async function startGame(roomCode: string, _: ActionState): Promise<ActionState> {
    try {
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.GameStart, e);
        return { success: false, message: ClientError.GameStart };
    }
}

export async function sendMessage(formData: FormData, _: ActionState): Promise<ActionState> {
    try {
        const roomCode = formData.get("room-code")?.toString();
        const message = formData.get("player-message")?.toString();
        const name = formData.get("player-name")?.toString();
        console.log(roomCode, message, name);
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.MessageSend, e);
        return { success: false, message: ClientError.MessageSend };
    }
} 

export async function checkCookie() {
    const result = await checkCookies('playerId');
    console.log('Cookie: ' + result);
}

export async function clearCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("playerId");
}

export async function sendUserCookieAction(): Promise<ActionSuccess<string> | StructuredError> {
    const result = await sendUserCookie();
    if(!result.success) {
        return { success: false, message: result.message };
    }
    return { success: true, data: result.playerId };
}