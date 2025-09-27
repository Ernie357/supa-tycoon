'use server';

import { ActionState, ActionSuccess, ClientError, ErrorStatus, StructuredError } from "@/lib/types";
import { logError } from "@/lib/utils";
import { checkCookies, sendUserCookie, supabaseInsert, supabaseUpsert } from "./actionOps";
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
    const generalError: StructuredError = { 
        success: false, 
        message: ClientError.RoomCreate 
    };
    const playerName = formData.get("player-name")?.toString();
    const playerImage = formData.get("player-image")?.toString();
    const isPublic = formData.get("is_public") === "on";
    if(!playerName || !playerImage) {
        return generalError;
    }
    console.log(playerName, playerImage, isPublic);
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
        const existingCookie = await checkCookies('playerId');
        const playerToInsert = {
            name: playerName,
            room_code: roomCode,
            score: null,
            rank: null,
            image_url: playerImage
        } 
        if(!existingCookie) {
            const cookieResult = await sendUserCookie();
            if(!cookieResult.success) {
                redirect('/room-error');
            }
            const playerInsertResult = await supabaseInsert("players", { ...playerToInsert, id: cookieResult.playerId });
            if(!playerInsertResult.success) {
                redirect('room-error')
            }
        } else {
            const playerInsertResult = await supabaseUpsert("players", { ...playerToInsert, id: existingCookie });
            if(!playerInsertResult.success) {
                redirect('room-error');
            }
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