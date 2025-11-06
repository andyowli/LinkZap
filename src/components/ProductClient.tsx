"use client"

import { SanityDocument } from "next-sanity";
import { JSX } from "react";
import { ArrowRight, Bot, PanelsTopLeft, WandSparkles, BookText, BriefcaseBusiness, Laptop, Backpack, PencilRuler, Handshake, Star } from "lucide-react";
import { Loading } from "./loading";
import { Navbar } from "./navbar";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { EmptyData } from "./empty-data";
import { Footer } from "./footer";

interface ProductClientProps {
    posts: SanityDocument[];
    sidebar: SanityDocument[];
    selectedCategory?: string;
}
const ProductClient  = ({ posts, sidebar, selectedCategory }: ProductClientProps) => {
    const sidebarIcons: Record<string, JSX.Element> = {
        AI: <Bot className="w-4 h-4 mr-2" />,
        UI: <PanelsTopLeft className="w-4 h-4 mr-2" />,
        Design: <WandSparkles className="w-4 h-4 mr-2" />,
        Travel: <Backpack className="w-4 h-4 mr-2" />,
        Community: <BookText className="w-4 h-4 mr-2" />,
        Work: <BriefcaseBusiness className="w-4 h-4 mr-2" />,
        "digital nomad": <Laptop className="w-4 h-4 mr-2" />,
        Tools: <PencilRuler className="w-4 h-4 mr-2" />,
        Business: <Handshake className="w-4 h-4 mr-2" />
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
            <Navbar />

            <div className="pt-24 container mx-auto max-w-7xl">
                <div className="flex items-center justify-center flex-col mb-8">
                    <h1 className="font-bold text-balance text-2xl sm:text-3xl md:text-4xl">
                        Your Ultimate
                        <span className="text-blue-500"> Directory of Directories</span>
                    </h1>
                    <p className="max-w-3xl text-balance text-muted-foreground sm:text-xl">Discover the best catalog and easily launch your products</p>
                </div>
                
                <div className="pb-16 px-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Sidebar */}
                            <div className="w-full md:w-64 flex-shrink-0">
                                <div className="bg-white dark:bg-black/20 rounded-xl shadow-sm dark:shadow-gray-700 p-5 sticky top-24">
                                    <h2 className="text-lg font-bold mb-4">Categories</h2>
                                    <div className="space-y-1">
                                        {sidebar.map((title) => (
                                            <Link
                                                key={title._id}
                                                href={`/product?category=${title.title.toLowerCase()}`}
                                                className="flex items-center py-2 px-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-100/50 rounded-md transition-colors"
                                            >
                                                {/* {title.icon} */}
                                                {sidebarIcons[title.title] || null} 
                                                <span>{title.title}</span>
                                                <ArrowRight className="w-4 h-4 ml-auto" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        
                        {/* Main Content */}
                        <div className="flex-1">
                            {posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map((post) => (
                                        <Link href={`/${post.slug}`} key={post._id}>
                                            <Card 
                                                key={post._id}
                                                className={`py-0 h-72 overflow-hidden hover:shadow-md transition-shadow ${
                                                    post.featured 
                                                        ? 'border-2 border-orange-500' 
                                                        : ''
                                                }`} 
                                            >
                                                <CardHeader className="p-0">
                                                    <div className="relative aspect-[16/9] overflow-hidden">
                                                        <Image
                                                            src={post.imgurl}
                                                            alt={post.title || 'Product image'}
                                                            fill
                                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                                        />
                                                    </div>
                                                </CardHeader>
                                            <CardContent className="mt-[-30] px-4">
                                                {/* <p className="text-lg font-semibold tracking-wider text-blue-500 mb-2">
                                                    {Array.isArray(post.category) ? post.category[0] : post.category}
                                                </p> */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <h3 className="font-bold text-xl line-clamp-2 m-0">{post.title}</h3>
                                                    {post.featured && (
                                                        <span className="flex items-center bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full ml-2 mt-1 whitespace-nowrap">
                                                            {/* <Star className="w-3 h-3 mr-1 fill-current" /> */}
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                                                    {post.content}
                                                </p>
                                            </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <EmptyData />
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </main>
    )
}

export default ProductClient;