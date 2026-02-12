'use client';
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
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { signUpAction } from "../app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 清除之前的错误

        if (password !== confirmPassword) {
            toast.error("The passwords entered twice do not match.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        try {
            const result = await signUpAction(formData);

            if ('error' in result) {
                toast.error(result.error);
                if (result.error) { 
                    toast.error(result.error);
                }
            } else if ('success' in result) {
                toast.promise<{ name: string }>(
                    () =>
                        new Promise((resolve) =>
                            setTimeout(() => resolve({ name: "Event" }), 1000)
                        ),
                    {
                        loading: "Loading...",
                        success: (data) => `Account registration successful!`,
                        error: "Error",
                    }
                )

                router.push('/sign-in');
            }
        } catch (err: any) {
            toast.error(err?.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="John Doe" 
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="focus-visible:ring-[#409eff] focus-visible:ring-[2px]" 
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="focus-visible:ring-[#409eff] focus-visible:ring-[2px]"
                                />
                            </Field>

                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            required 
                                            className="focus-visible:ring-[#409eff] focus-visible:ring-[2px]"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input 
                                            id="confirm-password" 
                                            type="password" 
                                            required
                                            className="focus-visible:ring-[#409eff] focus-visible:ring-[2px]" 
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit">Create Account</Button>
                                <FieldDescription className="text-center">
                                    Already have an account? <Link href="/sign-in">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
