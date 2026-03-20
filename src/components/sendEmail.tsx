'use client'

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { createAuthClient } from "better-auth/client";
import { useState } from "react";

export default function ForgotPasswordEmail() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const authClient = createAuthClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        
        if (!email) {
            setError("Please enter your email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            // First, check if the email is a Google login associated account; If so, do not send a reset email
            const eligibilityRes = await fetch("/api/auth/check-reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (eligibilityRes.ok) {
                const eligibility = (await eligibilityRes.json()) as {
                    canResetViaEmail?: boolean;
                    reason?: string;
                };

                if (eligibility.canResetViaEmail === false && eligibility.reason === "GOOGLE_ACCOUNT") {
                    setError("This account was created using Google login. Please go to the Google account settings to change your password.");
                    return;
                }
            }

            const { data, error: apiError } = await authClient.requestPasswordReset({
                email: email,
                redirectTo: "/forgot-password",
            });

            if (apiError) {
                // 如果是 Google 登录账号，在后端会抛出明确的错误信息，这里直接展示给用户
                setError(
                    apiError.message ||
                    "Failed to send reset link"
                );
                setIsLoading(false);
                return;
            }
            
            setSuccess(true);
            setEmail("");
        } catch (err) {
            setError("An unknown error has occurred, please try again later");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle  className="text-xl">Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="focus-visible:ring-[#409eff] focus-visible:ring-2"
                                />
                                {error && (
                                    <p className="text-sm text-red-500 mt-1">{error}</p>
                                )}
                                {success && (
                                    <p className="text-sm text-green-500 mt-1">
                                        Reset link sent successfully! Please check your email.
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="dark:text-white bg-[#409eff] hover:bg-[#409eff]/90 cursor-pointer"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
