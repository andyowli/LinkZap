"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { signOutAction } from "@/app/actions/auth";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";
import { MobileNav } from "./mobile-nav";

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface NavbarClientProps {
    isLoggedIn: boolean;
    user?: User | null;
}

export function NavbarClient({ isLoggedIn, user }: NavbarClientProps) {
    console.log(isLoggedIn, user);
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await signOutAction();
        setIsOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-10">
            <div className="w-full h-16 px-4 flex justify-center items-center">
                <div className="flex items-center justify-between container max-w-full md:max-w-7xl h-full">
                    <div className="flex items-center space-x-12">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Logo */}
                            <Image src="/logo.svg" alt="logo" width={40} height={40} />
                            <span className="font-bold text-lg">LinkZap</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/product" 
                                className="text-muted-foreground hover:text-foreground transition-colors" 
                            >
                                Product
                            </Link>
                            <Link 
                                href="/blog" 
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Blog
                            </Link>
                            <Link 
                                href="/price" 
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link 
                                href="/submit" 
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Submit
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2">
                        {isLoggedIn ? (
                            <>
                                {user && (
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || user.email || "User"}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                        ) : (
                                            <div 
                                                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold"
                                                style={{ backgroundColor: '#3b82f6' }}
                                            >
                                                {user.name}
                                            </div>
                                        )}
                                        </PopoverTrigger>
                                        <PopoverContent className="w-56 p-2 cursor-pointer" align="end">
                                            <div className="flex flex-col gap-1">
                                                <div className="px-3 py-2 text-sm">
                                                    <div className="font-medium">{user.name || "User"}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                                <div className="border-t my-1"></div>
                                                <div
                                                    className="w-full flex justify-start items-center text-sm p-1 hover:bg-gray-300/30"
                                                    onClick={handleSignOut}
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    LogOut
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </>
                        ) : (
                            <>
                                <Button size="sm" className="rounded-full hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white" asChild>
                                    <Link href="/sign-in">Sign in</Link>
                                </Button>
                                
                                <Button size="sm" className="rounded-full hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white" asChild>
                                    <Link href="/sign-up">Sign up</Link>
                                </Button>
                            </>
                        )}

                        <ThemeToggle />

                        <MobileNav />
                    </div>    
                </div>
            </div>
        </header>
    )
}

