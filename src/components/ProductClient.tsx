"use client"

import { SanityDocument } from "next-sanity";
import { JSX, useEffect, useState } from "react";
import { ArrowRight, Bot, PanelsTopLeft, WandSparkles, BookText, BriefcaseBusiness, Laptop, Backpack, PencilRuler, Handshake, Star, Images } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { EmptyData } from "./empty-data";
import { Footer } from "./footer";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../components/ui/pagination"
import { useSearchParams } from "next/navigation";

interface ProductClientProps {
    posts: SanityDocument[];
    sidebar: SanityDocument[];
    selectedCategory?: string;
}

const POSTS_PER_PAGE = 9;
const ProductClient  = ({ posts, sidebar }: ProductClientProps) => {
    const sidebarIcons: Record<string, JSX.Element> = {
        Featured: <Star className="w-4 h-4 mr-2" />,
        AI: <Bot className="w-4 h-4 mr-2" />,
        UI: <PanelsTopLeft className="w-4 h-4 mr-2" />,
        Design: <WandSparkles className="w-4 h-4 mr-2" />,
        Travel: <Backpack className="w-4 h-4 mr-2" />,
        Community: <BookText className="w-4 h-4 mr-2" />,
        Work: <BriefcaseBusiness className="w-4 h-4 mr-2" />,
        "digital nomad": <Laptop className="w-4 h-4 mr-2" />,
        Tools: <PencilRuler className="w-4 h-4 mr-2" />,
        Business: <Handshake className="w-4 h-4 mr-2" />,
        Image: <Images className="w-4 h-4 mr-2"/>,
    };
     // Add sorting logic before sidebar mapping
    const sortedSidebar = [...sidebar].sort((a, b) => {
        if (a.title === "Featured") return -1; // Featured placed at the forefront
        if (b.title === "Featured") return 1;
        return 0; // Maintain the original order for others
    });

    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

    // When selecting Features, only display products with feature set to true (these products will have orange borders)
    const filteredPosts = selectedCategory?.toLowerCase() === "featured"
        ? posts.filter(post => post.featured === true || post.featured === "true")
        : posts;

    // Paging state management
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    // Calculate the posts on the current page
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // Reset to the first page when posts change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredPosts]);

    // Handle page changes
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
            <div className="pt-24 container mx-auto max-w-7xl">
                <div className="flex items-center justify-center flex-col mb-8 text-center">
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
                                        {sortedSidebar.map((title) => (
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
                            {currentPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentPosts.map((post) => (
                                            <Card 
                                                key={post._id}
                                                className={`py-0 h-72 overflow-hidden cursor-pointer hover:shadow-md max-xl:w-full max-xl:h-64 relative transition-all duration-500 hover:scale-105 ${
                                                    post.featured 
                                                        ? 'border-2 border-orange-500/70' 
                                                        : ''
                                                }`} 
                                            >
                                                <CardHeader className="p-0">
                                                    <div className="relative aspect-[16/9] overflow-hidden max-sm:aspect-[14/9] group">
                                                        <Image
                                                            src={post.imgurl}
                                                            alt={post.title || 'Product image'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {/* Mask Overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl max-sm:rounded-xl">
                                                            <a 
                                                                href={post.webUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-white text-sm font-medium flex items-center justify-center"
                                                            >
                                                                Visit Website
                                                            </a>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="px-4 mt-[-10px] max-sm:absolute max-sm:bottom-0 max-sm:bg-gray-900/70 max-sm:text-white">
                                                    <Link href={`/${post.slug}`}>
                                                        <div className="flex items-center justify-between max-sm:mt-2.5">
                                                            <h3 className="font-bold text-lg md:text-md line-clamp-2 m-0">{post.title}</h3>
                                                            {post.featured && (
                                                                <span className="flex items-center bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full ml-2 mt-1 whitespace-nowrap">
                                                                    {/* <Star className="w-3 h-3 mr-1 fill-current" /> */}
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground text-sm line-clamp-2 mt-2 mb-2 max-md:text-white/80">
                                                            {post.content}
                                                        </p>
                                                    </Link>
                                                </CardContent>
                                            </Card>

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

            {/* pagination */}
            {totalPages > 1 && (
                <div className="container mx-auto max-w-7xl pb-8">
                    <Pagination>
                        <PaginationContent className="list-none flex justify-center">
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) {
                                            handlePageChange(currentPage - 1);
                                        }
                                    }}
                                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            
                            {/* show page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => {
                                const pageNum = i + 1;
                                // Only display 2 pages before and after the current page, as well as the first and last pages
                                const shouldShow = 
                                    pageNum === 1 || 
                                    pageNum === totalPages || 
                                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);
                                
                                if (shouldShow) {
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(pageNum);
                                                }}
                                                isActive={currentPage === pageNum}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return null;
                            })}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) {
                                            handlePageChange(currentPage + 1);
                                        }
                                    }}
                                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </main>
    )
}

export default ProductClient;