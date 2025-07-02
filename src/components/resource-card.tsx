import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: number
  name: string
  description: string
  category: string
  icon: string
}

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link href={`https://example.com/${resource.id}`} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
        {/* Image takes up full width */}
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={resource.icon || `/placeholder.svg?height=200&width=400`}
            alt={resource.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content below the image */}
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg">{resource.name}</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
        </CardContent>
        <CardFooter>
          <Badge variant="secondary" className="text-xs">
            {resource.category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
