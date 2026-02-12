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
                    <Button>Back Home</Button>
                    <Button variant="outline">View project</Button>
                </EmptyContent>
                <Button
                    variant="link"
                    asChild
                    className="text-muted-foreground"
                    size="sm"
                >
                    <a href="#">
                        There are currently no blogs available <ArrowUpRightIcon />
                    </a>
                </Button>
            </Empty>
        </div>
    )
}
