// general error rule: if it 

import { cookies } from "next/headers";
import { ActionSuccess, ClientError, DatabaseTables, ErrorStatus, StructuredError } from "./types";
import { logError } from "./utils";
import { createAdminClient } from "./supabase/admin";
import { Database } from "@/database.types";

type Return = Promise<ActionSuccess | StructuredError>;

export async function sendUserCookies(cookieKey: string, cookieValue: string): Return {
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