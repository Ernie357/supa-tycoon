'use server';

import { ClientError, ErrorStatus } from "@/lib/types";
import { logError } from "@/lib/utils";
import { sendUserCookies } from "./actionOps";
import { cookies } from "next/headers";

export async function createRoom() {
    try {
        const cookieResult = await sendUserCookies();
        if(!cookieResult.success) {
            return null;
        }

    } catch(e) {
        const error = e as Error;
        logError(ErrorStatus.RoomCreate, error.message);
        return { success: false, message: ClientError.RoomCreate }
    }
}

export async function checkCookie() {
    const cookieStore = await cookies();
    console.log(`Cookie: ${cookieStore.get("userId")?.value}`);
}

export async function clearCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
}