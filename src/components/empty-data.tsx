"use client"

import { RotateCw } from "lucide-react";
import { Button } from "./ui/button";

export const EmptyData = () => {
    return (
        <div className="h-[80vh] flex flex-col items-center justify-center">
            <img src="/IMG@1x.png"/>
            
            <div className="flex flex-col items-center justify-center mb-8">
                <h2>No data yet</h2>
                <p className="text-[#6B7280]">There is no content on this page. Please try again later.</p>
            </div>

            <Button 
                variant="outline"
                className="cursor-pointer"
                onClick={() => window.location.reload()}
            >
                <RotateCw className="text-[#0A0A0A]"/>
                Refresh the page
            </Button>
        </div>
    )
}