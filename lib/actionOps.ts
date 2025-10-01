// general error rule: if it 

import { cookies } from "next/headers";
import { ActionSuccess, ClientError, DatabaseTables, ErrorStatus, StructuredError } from "./types";
import { logError } from "./utils";
import { createAdminClient } from "./supabase/admin";
import { PostgrestError } from "@supabase/supabase-js";

type Return = Promise<ActionSuccess | StructuredError>;

export async function sendCookies(cookieKey: string, cookieValue: string): Return {
    try {
        const cookieStore = await cookies();
        cookieStore.set(cookieKey, cookieValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.Cookie, e);
        return { success: false, message: ClientError.Cookie };
    }
}

export async function sendUserCookie(): Promise<{ success: true, playerId: string } | StructuredError> {
    const playerId = crypto.randomUUID();
    const cookieResult = await sendCookies("playerId", playerId);
    if(!cookieResult.success) {
        return cookieResult;
    }
    return { success: true, playerId: playerId };
}

export async function checkCookies(cookieKey: string): Promise<string | null> {
    const cookieStore = await cookies();
    const result = cookieStore.get(cookieKey);
    return result === undefined ? null : result.value;
}

export async function supabaseUpsert<K extends keyof DatabaseTables>(
    tableName: K, 
    data: DatabaseTables[K]["Insert"]
): Promise<ActionSuccess<DatabaseTables[K]["Insert"]> | StructuredError<{errorCode: string}>>
{
    try {
        const supabase = createAdminClient();
        const roomResult = await supabase.from(tableName).upsert(data);
        if(roomResult.error) {
            throw new Error(JSON.stringify(roomResult.error));
        }
        return { success: true, data: data };
    } catch(e) {
        if(!(e instanceof PostgrestError)) {
            logError(ErrorStatus.PGInsert, "unknown error.");
            return { success: false };
        }
        logError(ErrorStatus.PGInsert, e);
        return { success: false, specifics: { errorCode: e.code } };
    }
}

export async function supabaseInsert<K extends keyof DatabaseTables>(
    tableName: string, 
    data: DatabaseTables[K]["Insert"]
): Promise<ActionSuccess<DatabaseTables[K]["Insert"]> | StructuredError<{errorCode: string}>>
{
    try {
        const supabase = createAdminClient();
        const roomResult = await supabase.from(tableName).insert(data);
        if(roomResult.error) {
            throw new Error(JSON.stringify(roomResult.error));
        }
        return { success: true, data: data };
    } catch(e) {
        if(!(e instanceof PostgrestError)) {
            logError(ErrorStatus.PGInsert, "unknown error.");
            return { success: false };
        }
        logError(ErrorStatus.PGInsert, e);
        return { success: false, specifics: { errorCode: e.code } };
    }
}

// type DeleteReturn = Promise<ActionSuccess | StructuredError<{errorCode: string}>>;
// export async function supabaseDelete<T = DatabaseTables>(tableName: string, data: T): DeleteReturn {
//     try {
//         const supabase = createAdminClient();
//         const deleteResult = await supabase.from(tableName).delete()
//     } catch(e) {
//         if(!(e instanceof PostgrestError)) {
//             logError(ErrorStatus.PGInsert, "unknown error.");
//             return { success: false };
//         }
//         logError(ErrorStatus.PGDelete, e);
//         return { success: false, specifics: { errorCode: e.code } };
//     }
//     return { success: false };
// }

export async function handleInitPlayerConnection(
    playerName: string,
    playerImage: string,
    roomCode: string
): Promise<ActionSuccess | StructuredError> {
    try {
        const existingCookie = await checkCookies('playerId');
        const playerToInsert = {
            name: playerName,
            room_code: roomCode,
            score: null,
            rank: null,
            image_url: playerImage,
            public_id: crypto.randomUUID()
        } 
        if(!existingCookie) {
            const cookieResult = await sendUserCookie();
            if(!cookieResult.success) {
                throw new Error();
            }
            const playerInsertResult = await supabaseInsert("players", { ...playerToInsert, id: cookieResult.playerId });
            if(!playerInsertResult.success) {
                throw new Error();
            }
        } else {
            const playerInsertResult = await supabaseUpsert("players", { ...playerToInsert, id: existingCookie });
            if(!playerInsertResult.success) {
                throw new Error();
            }
        }
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.RoomConnection, e);
        return { success: false };
    }
}