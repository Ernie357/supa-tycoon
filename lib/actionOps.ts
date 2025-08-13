// general error rule: if it 

import { cookies } from "next/headers";
import { ActionSuccess, ClientError, DatabaseTables, ErrorStatus, StructuredError } from "./types";
import { logError } from "./utils";
import { createAdminClient } from "./supabase/admin";

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

export async function supabaseInsert<T = DatabaseTables>(tableName: string, data: T): Return {
    try {
        const supabase = createAdminClient();
        const roomResult = await supabase.from(tableName).insert(data);
        if(roomResult.error) {
            throw new Error(JSON.stringify(roomResult.error));
        }
        return { success: true };
    } catch(e) {
        logError(ErrorStatus.PGInsert, e);
        return { success: false };
    }
}