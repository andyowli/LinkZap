"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { MobileNav } from "./mobile-nav";
import { SignOutButton, useUser } from "@clerk/nextjs";  
import { ArrowRight } from "lucide-react";


interface NavbarProps {
    onProductClick?: () => void; // 添加 onProductClick 属性
}
export const Navbar = ({ onProductClick }: NavbarProps) => {
    const { user } = useUser();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-10">
            <div className="container mx-auto h-full px-4">
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-12">
                <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        LinkZap
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link 
                        href="/product" 
                        className="text-muted-foreground hover:text-foreground transition-colors" 
                        onClick={onProductClick} // 直接调用 onProductClick
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
                    {/* <Button size="sm" className="rounded-full hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white" asChild>
                        <Link href="/sign-in">Sign in</Link>
                    </Button> */}

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