import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_NEON_CONNECTION_STRING,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    }

    const normalizedEmail = email.trim();

    // better-auth (PostgreSQL) uses quoted, case-sensitive identifiers:
    // table: "user", columns: "id","email"; table: "account", columns: "userId","providerId"
    const userRes = await pool.query<{ id: string }>(
      'SELECT "id" FROM "user" WHERE "email" = $1',
      [normalizedEmail]
    );

    // If user doesn't exist, let better-auth client flow handle it gracefully.
    if (userRes.rowCount === 0) {
      return NextResponse.json({ canResetViaEmail: true });
    }

    const userId = userRes.rows[0].id;

    const accountsRes = await pool.query<{ providerId: string | null }>(
      'SELECT "providerId" FROM "account" WHERE "userId" = $1',
      [userId]
    );

    const hasGoogleAccount = accountsRes.rows.some((acc) =>
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

