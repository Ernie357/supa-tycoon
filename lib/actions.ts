'use server';

import { ActionSuccess, ClientError, DatabasePlayers, DatabaseRooms, ErrorStatus, StructuredError } from "@/lib/types";
import { logError } from "@/lib/utils";
import { checkCookies, sendUserCookie, supabaseInsert } from "./actionOps";
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
        roomCode = generateRandomString(8);
        const roomInsertResult = await supabaseInsert<DatabaseRooms["Insert"]>("rooms", {
            code: roomCode,
            is_public: true
        });
        if(!roomInsertResult.success) {
            return generalError;
        }
        const playerExists = await checkCookies("playerId");
        if(!playerExists) {
            const newIdResult = await sendUserCookie();
            if(!newIdResult.success) {
                return newIdResult;
            }
            const playerInsertResult = await supabaseInsert<DatabasePlayers["Insert"]>("players", {
                id: newIdResult.playerId,
                name: "Johnny Tycoon",
                room_code: roomCode,
                score: null,
                rank: null,
                image_url: "Johnny image_url"
            });
            if(!playerInsertResult.success) {
                return generalError;
            }
        }
    } catch(e) {
        logError(ErrorStatus.RoomCreate, e);
        return generalError;
    }
    // this internally throws err for some reason so must be outside try/catch
    redirect(`/${roomCode}`);
}

export async function checkCookie() {
    const result = await checkCookies('playerId');
    console.log('Cookie: ' + result);
}

export async function clearCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("playerId");
}