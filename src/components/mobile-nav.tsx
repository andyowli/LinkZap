"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SignOutButton, useUser } from "@clerk/nextjs";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const { user } = useUser();


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Product Collection
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 px-4 -mt-2">
          <Link
            href="/product"
            className="px-2 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            Product
          </Link>
          <Link
            href="/recommended"
            className="px-2 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/price"
            className="px-2 py-2 text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <div className="pt-4 mt-4 border-t">
            {/* <Button className="w-full rounded-full" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button> */}

          {user ? (
              <>
                <Button className="w-full mb-4 bg-[#409eff] hover:bg-[#409eff]/90 text-white">
                  Submit
                  <ArrowRight />
                </Button>
                <SignOutButton>
                  <Button variant="secondary" className="w-full">Sign out</Button>
                </SignOutButton>
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
            )}

          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
