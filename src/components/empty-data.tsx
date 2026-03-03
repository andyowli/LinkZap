import Link from "next/link";
import { Button } from "../components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "../components/ui/empty";
import { ArrowUpRightIcon,FileText } from "lucide-react";

export function EmptyData() {
    return (
        <div>
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileText />
                    </EmptyMedia>
                    <EmptyTitle>No data available</EmptyTitle>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                    <Button>
                        <Link href="/">Back Home</Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/product">View project</Link>
                    </Button>
                </EmptyContent>
                <Button
                    variant="link"
                    asChild
                    className="text-muted-foreground"
                    size="sm"
                >
                    <Link href="#">
                        There is no available content at the moment <ArrowUpRightIcon />
                    </Link>
                </Button>
            </Empty>
        </div>
    )
}
