import Link from "next/link";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import Image from "next/image";
import { Badge } from "./ui/badge";

type Props = {
    products: Array<{
        id: string;
        title: string;
        slug: string;
        category: Array<string>;
        imgurl: string;
        content: string;
        webUrl?: string;
    }>;
}

export function MoreCarousel({ products }: Props) {
    return (
        <div className="w-full max-w-[80rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex flex-col justify-between"
                    >
                        <Card className="py-0">
                            <CardHeader className="p-0">
                                <div className="w-full relative overflow-hidden h-[150px] group">
                                    <Image 
                                        src={product.imgurl}
                                        alt={product.title}
                                        fill
                                        unoptimized
                                        className="rounded-t-xl object-cover"
                                    />
                                    <a 
                                        href={product.webUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Visit Website
                                        </div>
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="w-full px-4 mt-[-1rem]">
                                <Link href={`/${product.slug}`}>
                                    <h3 className="m-0 font-semibold text-lg mt-2 mb-2 text-blue-400">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.content}</p>
                                    <div className="relative mt-12">
                                        <div className="absolute bottom-4 right-0">
                                            {product.category.map((category, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-500 text-white ml-2 first:ml-0">
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                ))}
        </div>
    );
}
