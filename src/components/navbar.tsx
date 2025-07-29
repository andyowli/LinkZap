"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { MobileNav } from "./mobile-nav";
import { SignOutButton, useUser } from "@clerk/nextjs";  
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
    const { user } = useUser();


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
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2">
                        {user ? (
                            <>
                                <Button  className="hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white">
                                    <Link href="/submit">submit</Link>
                                    <ArrowRight />
                                </Button>
                                <SignOutButton>
                                    <Button variant={"ghost"} className="hidden md:inline-flex">Sign out</Button>
                                </SignOutButton>
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

                        <MobileNav />
                    </div>    
                </div>
            </div>
        </header>
    )
}