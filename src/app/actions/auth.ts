'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../../../db/index";
import { user, account } from "../../../db/schema";
import { eq } from "drizzle-orm";


export async function signUpAction(formData: FormData): Promise<{ error: string } | { success: true }> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
        await auth.api.signUpEmail({
            body:{
                name,
                email,
                password,
            }
        });

        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Registration failed, please try again' };
    }
}

export async function signInAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const callbackUrl = formData.get('callbackUrl') as string;

    try {
        // First, check if this email is only associated with social media accounts
        const userRes = await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.email, email));

        if (userRes.length > 0) {
            const accounts = await db
                .select({ providerId: account.providerId })
                .from(account)
                .where(eq(account.userId, userRes[0].id));

            const hasOnlySocialAccount = accounts.length > 0 &&
                accounts.every((acc: { providerId: string; }) => acc.providerId && !acc.providerId.toLowerCase().includes('credential'));

            if (hasOnlySocialAccount) {
                const hasGoogleAccount = accounts.some((acc: { providerId: string; }) =>
                    acc.providerId && acc.providerId.toLowerCase().includes('google')
                );

                if (hasGoogleAccount) {
                    return { error: "This account is registered with Google. Please sign in using the 'Login with Google' button." };
                }
            }
        }

        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        });

        return { success: true, redirectUrl: callbackUrl || '/' };
    } catch (error: any) {
        return { error: error.message || 'Registration failed, please try again' };
    }
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    redirect('/');
}



