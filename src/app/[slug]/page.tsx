import { EmptyData } from "../../components/empty-data";
import { Navbar } from "../../components/navbar-wrapper";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { client } from "../../sanity/client";
import { PortableText, SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "../../components/footer";
import { ClientComponent } from "../../components/affiliate";
import { MoreCarousel } from "../../components/more-carousel";
import { LayoutDashboard } from "lucide-react";
import Banner from "../../components/banner";

const getPage = `*[ _type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "imgurl":image.asset->url,
    "iconurl":icon.asset->url,
    "content":body,
    website,
    affiliate,
    category
}`;

const getRelatedProducts = `*[_type == "post" && slug.current != $slug && defined(category) && count(category[@ in $categories]) > 0][0...3]{
    _id,
    title,
    "imgurl":image.asset->url,
    "slug":slug.current,
    "category":category,
    "content":body,
    website
}`;

const options = { next: { revalidate: 30 } };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    const page = await client.fetch<SanityDocument>(getPage, { slug: resolvedParams.slug }, options);
    

    if (!page) {
        return {
            title: 'Page not found',
            description: 'The requested product page could not be found.',
            openGraph: {
                type: 'website',
                title: 'Page not found',
                description: 'The requested product page could not be found.',
                url: `https://www.linkzap.link/${resolvedParams.slug}`,
            },
        };
    }
    
    // Extract descriptive text and process content data in different formats
    let description = 'Discover this amazing product';
    if (page.content?.[0]?.children?.[0]?.text) {
        description = page.content[0].children[0].text.slice(0, 160);
    } else if (typeof page.content === 'string') {
        description = page.content.slice(0, 160);
    }
    
    return {
        title: page.title,
        description,
        keywords: [
            page.title,
            ...(Array.isArray(page.category) ? page.category : [page.category]).filter(Boolean)
        ],
        openGraph: {
            type: 'website',
            title: page.title,
            description,
            url: `https://www.linkzap.link/${resolvedParams.slug}`,
            images: page.imgurl ? [
                {
                url: page.imgurl,
                alt: page.title || 'Product image',
                width: 1200,
                height: 630,
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description,
            images: page.imgurl ? [page.imgurl] : [],
        },
        // Add canonical link
        alternates: {
            canonical: `https://www.linkzap.link/${resolvedParams.slug}`,
        },
    };
}

export default async function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = await params;

    const page = await client.fetch<SanityDocument>(getPage, {slug}, options);
    
    const relatedProducts = await client.fetch<SanityDocument[]>(getRelatedProducts, {
        slug,
        categories: page.category || []
    }, options);

    const extractPlainText = (content: any): string => {
        if (!content || !Array.isArray(content)) return '';
        return content
        .map((block: any) =>
            block.children
            ?.map((child: any) => child.text || '')
            .join(' ')
        )
        .join(' ');
    };

    if (!page) {
        return (
            <div className="flex flex-col min-h-screen">
                <Banner />

                <Navbar topClass="top-10" />

                <div className="flex-1 flex items-center justify-center">
                    <EmptyData />
                </div>

                <Footer />
            </div>
        );
    }

    const handleClick = () => {
        window.location.href = page.affiliate;
    };

    
    // Generate JSON-LD structured data only when the page exists
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": page.title,
        "description": page.content?.[0]?.children?.[0]?.text || 'Discover this amazing product',
        "image": page.imgurl,
        "url": `https://www.linkzap.link/${slug}`,
        "category": Array.isArray(page.category) ? page.category[0] : page.category,
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            {/* <div> */}
                <Banner />

                <Navbar topClass="top-10"/>
            {/* </div> */}
            

            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex-1 pt-10">
                <div className="container mx-auto max-w-[80rem] flex items-center gap-3 px-4">
                    {page.iconurl && (
                        <div className="rounded-lg dark:bg-white p-1 backdrop-blur-sm">
                            <Image 
                                src={page.iconurl} 
                                alt="" 
                                width={60}
                                height={60}
                                unoptimized={process.env.NODE_ENV === "development"}
                            />
                        </div>
                    )}

                    <span className="text-2xl font-bold">{page.title}</span>
                </div>

                <div className="container mx-auto max-w-[80rem] mt-10 px-4">
                    <Button 
                        className="bg-[#409eff] hover:bg-[#409eff]/90 dark:text-white"
                    >
                        <Link 
                            href={page.affiliate ? page.affiliate : page.website} 
                            target="_blank"
                        >
                            Visit Website
                        </Link>
                    </Button>
                </div>

                <div className="container mx-auto max-w-[80rem] flex flex-col md:flex-row items-start justify-between mt-12 max-2xl:p-4">
                    <Card className="p-5 w-full md:w-3/5 self-start bg-gray-300/10 max-sm:mb-6">
                        <div className="text-lg">
                            <PortableText value={page.content} />
                        </div>
                    </Card>
                    
                    <div className="space-y-6 md:space-y-10 w-full md:w-2/6 lg:w-1/3">
                        <Card className="w-full md:w-11/12 py-0">
                            {page.imgurl && (
                                <Image
                                    src={page.imgurl} 
                                    alt={page.title || 'Product image'} 
                                    width={600}
                                    height={300}
                                    className="w-full h-60 rounded-xl object-cover"
                                    priority
                                    unoptimized={process.env.NODE_ENV === "development"}
                                />
                            )}
                        </Card>

                        <Card className="w-full md:w-11/12">
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>

                            <CardContent className="space-x-4">
                                {page.category?.map((category:string) => (
                                    <Button 
                                        key={category}
                                        className="bg-[#409eff] hover:bg-[#409eff]/90 dark:text-white cursor-pointer"
                                    >{category}</Button>
                                ))}
                            </CardContent>
                        </Card>

                        <ClientComponent 
                            affiliate={page.affiliate ? page.affiliate : page.website} 
                            website={page.website} 
                        />
                    </div>
                </div>
                {/* more */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="container mx-auto max-w-[82rem] mt-12 p-4">
                        <div className="flex items-center gap-2 mb-6">
                            <LayoutDashboard className="text-blue-500" />
                            <h3 className="text-lg font-semibold leading-none m-0">
                                More product
                            </h3>
                        </div>
                        <MoreCarousel
                            products={relatedProducts.map((product: any) => ({
                                id: product._id,
                                title: product.title,
                                slug: product.slug,
                                category: Array.isArray(product.category) ? product.category : [product.category].filter(Boolean),
                                imgurl: product.imgurl,
                                content: extractPlainText(product.content),
                                webUrl: product.website || undefined,
                            }))}
                        />
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}