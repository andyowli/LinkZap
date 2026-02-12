'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getIsLoggedIn() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    return session;
}
