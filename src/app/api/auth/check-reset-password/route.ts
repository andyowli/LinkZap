
import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

// Initialize database connection, consistent with auth.ts
const db = new Database(path.join(process.cwd(), "sqlite.db"));

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        // Verify email parameters
        if (!email) {
            return NextResponse.json(
                { error: "Email cannot be empty" },
                { status: 400 }
            );
        }

        // 1. Search for users based on email
        const user = db
            .prepare("SELECT id, email FROM user WHERE email = ?")
            .get(email) as { id: string; email: string } | undefined;

        if (!user) {
            // Allow the process to continue when the user does not exist, with errors handled by authClient. requestPasswordReset
            return NextResponse.json({
                canResetViaEmail: true,
            });
        }

        // 2. Check if social media accounts (especially Google) are associated
        const accounts = db
            .prepare("SELECT providerId FROM account WHERE userId = ?")
            .all(user.id) as { providerId: string }[];

        const hasGoogleAccount = accounts?.some((acc) =>
            (acc.providerId || "").toLowerCase().includes("google")
        );

        // 3. Determine whether password reset through email is allowed
        if (hasGoogleAccount) {
            return NextResponse.json({
                canResetViaEmail: false,
                reason: "GOOGLE_ACCOUNT",
            });
        }

        return NextResponse.json({
            canResetViaEmail: true,
        });
    } catch (error) {
        console.error("[CheckResetPassword] error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}