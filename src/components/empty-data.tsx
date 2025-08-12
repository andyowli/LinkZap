"use client"

import { RotateCw } from "lucide-react";
import { Button } from "./ui/button";
import { Empty } from 'antd';

export const EmptyData = () => {
    return (
        <div className="h-[80vh] flex flex-col items-center justify-center">
            <div className="mb-8">
                <Empty 
                    description={<span className="dark:text-[#6B7280] text-gray-600">No Data</span>}
                />
                <p className="text-[#6B7280]">There is no content on this page,please try again later.</p>
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