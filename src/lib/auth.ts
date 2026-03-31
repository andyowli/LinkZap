import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { getDb } from "../lib/db"; 


const resend = new Resend(process.env.RESEND_API_KEY as string);
// const db = new Pool({
//     connectionString: process.env.NEXT_PUBLIC_NEON_CONNECTION_STRING,
// })

// Generate password reset email HTML
function generateResetPasswordEmail(firstName: string, resetUrl: string): string {
    console.log(resetUrl);
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; margin-top: 0;">
            Reset Your Password
        </h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello ${firstName},
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
            <a
                href="${resetUrl}"
                style="display: inline-block; padding: 12px 30px; background-color: #409eff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;"
            >
                Reset Password
            </a>
        </div>
        <p style="color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If you didn't request this password reset, please ignore this email.
        </p>
        <p style="color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
            This link will expire in 24 hours.
        </p>
    </div>
</body>
</html>
    `.trim();
}

export const auth = betterAuth({
    database: async () => {
        const sql = await getDb();
        return sql;
    },
    baseURL: process.env.BETTER_AUTH_URL || "https://linkzap.link",
    emailAndPassword: {
        enabled: true, 
        sendResetPassword: async ({ user, url, token }, request) => {
            try {
                // Use PostgreSQL to check if the current user has bound a social account (such as Google)
                const db = await getDb();
                const emailResult = await db.query(
                    'SELECT "providerId" FROM "account" WHERE "userId" = $1',
                    [user.id]
                );

                const rows = emailResult as Array<{ providerId: string | null }>;

                const hasGoogleAccount = rows?.some((acc) =>
                    (acc.providerId || "").toLowerCase().includes("google")
                );

                // The Google login account itself does not have an internal password, so password reset emails should not be sent
                if (hasGoogleAccount) {
                    console.log(
                        `[Password Reset] Block sending reset email for Google-linked account: ${user.email}`
                    );
                    // Throwing an error to give the frontend a clear prompt
                    throw new Error(
                        "This account was created using Google login. Please change your password in your Google account settings."
                    );
                }
                
                const result = await resend.emails.send({
                    from: "LinkZap <noreply@linkzap.link>",
                    to: user.email,
                    subject: "Reset your password",
                    html: generateResetPasswordEmail(user.name ?? user.email, url),
                });

                console.log("[Password Reset] Email sent successfully:", result);
                
            } catch (error: any) {
                console.error("[Password Reset] Failed to send email:", error);
                console.error("[Password Reset] Error details:", {
                    message: error?.message,
                    status: error?.status,
                    response: error?.response
                });
                throw error;
            }
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`The password for User ${user.email} has been reset.`);
        },
    }, 
    emailVerification: {
        sendOnSignUp: true,
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    account: {
        accountLinking: {
            enabled: true, // Enable account association
            updateUserInfoOnLink: true, // Update user information (name, avatar, etc.) when associating with a new account
        },
    },
    plugins: [nextCookies() as any]
})