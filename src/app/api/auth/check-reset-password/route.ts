import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

interface CheckResetPasswordRequest {
  email?: string; 
}

const connectionString = process.env.NEXT_PUBLIC_NEON_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Missing NEXT_PUBLIC_NEON_CONNECTION_STRING environment variable");
}

const sql = neon(connectionString);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckResetPasswordRequest;
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    }

    const normalizedEmail = email.trim();

    const userRes = await sql`SELECT "id" FROM "user" WHERE "email" = ${normalizedEmail}`;

    if (userRes.length === 0) {
      return NextResponse.json({ canResetViaEmail: true });
    }

    const userId = userRes[0].id;

    const accountsRes = await sql`SELECT "providerId" FROM "account" WHERE "userId" = ${userId}`;

    const hasGoogleAccount = accountsRes.some((acc) =>
      (acc.providerId || "").toLowerCase().includes("google")
    );

    if (hasGoogleAccount) {
      return NextResponse.json({
        canResetViaEmail: false,
        reason: "GOOGLE_ACCOUNT",
      });
    }

    return NextResponse.json({ canResetViaEmail: true });
  } catch (error) {
    console.error("[CheckResetPassword] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}