'use client'

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ClientComponentProps {
    affiliate: string;
    website: string;
}

export function ClientComponent({ affiliate, website }: ClientComponentProps) {
    const linkUrl = affiliate || website;
    const handleClick = () => {
        if (linkUrl) {
            window.open(linkUrl, '_blank');
        }
    };

    return (
        <Card className="w-full md:w-3/4 gap-1 mb-4"> 
            <CardHeader>
                <CardTitle>website</CardTitle>
            </CardHeader>

            <CardContent> 
                <Button 
                    variant="link" 
                    className="justify-start px-0"
                    onClick={handleClick} 
                >
                    {website}
                </Button>
            </CardContent>
        </Card>
    );
}