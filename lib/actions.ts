'use server';

import { ActionSuccess, ClientError, ClientSuccess, ErrorStatus, StructuredError } from "@/lib/types";
import { logError } from "@/lib/utils";
import { sendUserCookies, supabaseInsert } from "./actionOps";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        const userId = crypto.randomUUID();
        const cookieResult = await sendUserCookies("userId", userId);
        if(!cookieResult.success) {
            return cookieResult;
        }
        roomCode = generateRandomString(8);
        const roomInsertResult = await supabaseInsert("rooms", {
            code: roomCode,
            is_public: true
        });
        if(!roomInsertResult.success) {
            return generalError;
        }
        const playerInsertResult = await supabaseInsert("players", {
            id: userId,
            name: "Johnny Tycoon",
            room_code: roomCode,
            score: null,
            rank: null,
            image_url: "Johnny image_url"
        });
        if(!playerInsertResult.success) {
            return generalError;
        }
    } catch(e) {
        logError(ErrorStatus.RoomCreate, e);
        return generalError;
    }
    // this internally throws err for some reason so must be outside try/catch
    redirect(`/${roomCode}`);
}

export async function checkCookie() {
    const cookieStore = await cookies();
    console.log(`Cookie: ${cookieStore.get("userId")?.value}`);
}

export async function clearCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
}