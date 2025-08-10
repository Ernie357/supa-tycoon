import { cookies } from "next/headers";
import { ClientError, ErrorStatus, StructuredError } from "./types";
import { logError } from "./utils";

type Return = Promise<{ success: true, userId: string } | StructuredError>;

export async function sendUserCookies(): Return {
    try {
        const userId = crypto.randomUUID();
        const cookieStore = await cookies();
        cookieStore.set("userId", userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        return { success: true, userId: userId };
    } catch(e) {
        const error = e as Error;
        const status = ErrorStatus.Cookie;
        logError(status, error.message);
        return { success: false, clientMessage: ClientError.Cookie };
    }
}