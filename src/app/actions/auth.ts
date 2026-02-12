'use server'

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


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
        return { error: error.message || '注册失败，请重试' };
    }
}

export async function signInAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const callbackUrl = formData.get('callbackUrl') as string;

    await auth.api.signInEmail({
        body:{
            email,
            password,
        }
    });

    // If there is a callbackURL, redirect to that URL, otherwise redirect to the homepage
    redirect(callbackUrl || '/');
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers()
    });

    redirect('/');
}



