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
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { createAuthClient } from "better-auth/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default  function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const authClient = createAuthClient();

    useEffect(() => {
        // Get token from URL query parameters on the client side
        const urlToken = new URLSearchParams(window.location.search).get("token");
        console.log(urlToken);
        setToken(urlToken);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) return;

        try {
            const { data, error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                setErr(error.message ?? "An unknown error occurred.");
                toast.error(err);
            } else {
                setSuccess(true);
                toast.success("Password reset successfully!");
            }
        } catch (error) {
            setErr("An unexpected error occurred.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle  className="text-xl">Forgot password</CardTitle>
                    <CardDescription>
                        Reset your account password here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <Input 
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    className="focus-visible:ring-[#409eff] focus-visible:ring-[2px]"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <Button 
                                    type="submit"
                                    disabled={!token || password.length === 0}
                                >
                                    Submit
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
