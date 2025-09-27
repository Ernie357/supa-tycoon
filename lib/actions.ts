'use server';

import { ActionSuccess, ClientError, DatabasePlayers, DatabaseRooms, ErrorStatus, StructuredError } from "@/lib/types";
import { logError } from "@/lib/utils";
import { checkCookies, sendUserCookie, supabaseInsert } from "./actionOps";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supabase/admin";

type ActionState = ActionSuccess | StructuredError;

function generateRandomString(length: number): string {
    let result = "";
    let values = "abcdefghijklmnopqrstuvwxyz1234567890";
    for(let idx = 0; idx < length; idx++) {
        result += values[Math.floor(Math.random() * values.length)];
    }
    return result;
}

export async function createRoom(_: ActionState): Promise<ActionState> {
    const generalError: StructuredError = { 
        success: false, 
        message: ClientError.RoomCreate 
    };
    let roomCode: string;
    try {
        roomCode = generateRandomString(8);
        const roomInsertResult = await supabaseInsert("rooms", {
            code: roomCode,
            is_public: true
        });
        if(!roomInsertResult.success) {
            return generalError;
        }
    } catch(e) {
        logError(ErrorStatus.RoomCreate, e);
        return generalError;
    }
    // this internally throws err for some reason so must be outside try/catch
    redirect(`/${roomCode}`);
}

// todo: consolidate into (hopefully?) singular supabase function to reduce calls
export async function removePlayerFromRoom(_: ActionState): Promise<ActionState> {
    try {
        const supabase = createAdminClient();
        const playerId = await checkCookies('playerId');
        const playerDeleteResult = (await supabase.from("players").delete().eq("id", playerId).select('room_code'));
        if(playerDeleteResult.error) {
            throw new Error(playerDeleteResult.error.details);
        }
        const roomCode = playerDeleteResult.data?.[0]?.room_code;
        const playersRemaining = (await supabase.from("players").select("*").eq("room_code", roomCode)).count;
        if(!playersRemaining && roomCode) {
            const roomDeleteResult = await supabase.from("rooms").delete().eq("code", roomCode);
            if(roomDeleteResult.error) {
                throw new Error(roomDeleteResult.error.details);
            }
        }
    } catch(e) {
        logError(ErrorStatus.RoomLeave, e);
        return { success: false, message: ClientError.RoomLeave };
    }
    redirect("/");
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