'use client'

import { SignUp } from "@clerk/nextjs";

const Page = () => {
    return (
        <div className="w-full h-screen flex flex-1 items-center justify-center">
            <SignUp />
        </div>
    )
}

export default Page;