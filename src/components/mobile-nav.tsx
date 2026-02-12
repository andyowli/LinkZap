"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardType, CreditCard, FileText, LayoutList, LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { getIsLoggedIn } from "@/action/session";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { signOutAction } from "../app/actions/auth";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface MobileNavProps {
  // isLoggedIn: boolean;
  user?: User | null;
}

export function MobileNav({user} : MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    setIsOpen(false);
};

  useEffect(() => {
    async function checkLoginStatus() {
      const session = await getIsLoggedIn();
      setIsLoggedIn(!!session);
    }
    checkLoginStatus();
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                <span className="ml-[-26]">LinkZap</span>
              </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 px-4 -mt-2">
          <Link
            href="/product"
            className="flex gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <LayoutList className="h-5 w-5"/>
            Product
          </Link>
          <Link
            href="/recommended"
            className="flex gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <FileText className="h-5 w-5"/>
            Blog
          </Link>
          <Link
            href="/price"
            className="flex gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <CreditCard className="h-5 w-5"/>
            Pricing
          </Link>
          <Link 
            href="/submit" 
            className="flex gap-2 px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            <ClipboardType className="h-5 w-5"/>
            Submit
          </Link>
          <div className="pt-4 mt-4 border-t">
            {isLoggedIn ? (
                <>
                  {user && (
                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                          <PopoverTrigger asChild>
                              <Image
                                  src={user.image ?? "/default-avatar.png"}
                                  alt={user.name || user.email || "User"}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                  unoptimized
                              />
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
                                      退出登录
                                  </div>
                              </div>
                          </PopoverContent>
                      </Popover>
                  )}
                </>
              ) : (
                <>
                  <Button size="sm" className="w-full mb-4 rounded-full bg-[#409eff] hover:bg-[#409eff]/90 text-white" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  
                  <Button size="sm" className="w-full rounded-full bg-[#409eff] hover:bg-[#409eff]/90 text-white" asChild>
                    <Link href="/sign-up">Sign up</Link>
                  </Button>
                </>
              )
            }
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
