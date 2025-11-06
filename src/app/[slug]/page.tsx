// import { JSX } from "react";
import { EmptyData } from "../../components/empty-data";
import { Navbar } from "../../components/navbar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { client } from "../../sanity/client";
import { PortableText, SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Footer } from "../../components/footer";

const getPage = `*[ _type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "imgurl":image.asset->url,
    "iconurl":icon.asset->url,
    "content":body,
    website,
    category
}`;

const options = { next: { revalidate: 30 } };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    // const page = await client.fetch<SanityDocument>(getPage, { slug: params.slug }, options);
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
    
    // 提取描述文本，处理不同格式的content数据
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
        // 添加canonical链接
        alternates: {
        canonical: `https://www.linkzap.link/${resolvedParams.slug}`,
        },
    };
}

// interface PageProps {
//     params: {
//         slug: string;
//     };
// }


export default async function Page({params}: {params: Promise<{ slug: string }>}) {
    const { slug } = await params;

    const page = await client.fetch<SanityDocument>(getPage, {slug}, options);
    
    // 先检查页面是否存在
    if (!page) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <EmptyData />
                <Footer />
            </div>
        );
    }
    
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
        <div className="min-h-screen">
            <Navbar />
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mt-24 container mx-auto max-w-[85rem] flex items-center gap-3 px-4">
                {page.iconurl && (
                    <div className="rounded-lg dark:bg-white p-1 backdrop-blur-sm">
                        <Image 
                        src={page.iconurl} 
                        alt="" 
                        width={60}
                        height={60}
                        />
                    </div>
                )}

                
                <span className="text-2xl font-bold">{page.title}</span>
            </div>

            <div className="container mx-auto max-w-[85rem] mt-10 px-4">
                <Button 
                    className="bg-[#409eff] hover:bg-[#409eff]/90 dark:text-white"
                >
                    <Link
                        href={page.website} 
                        target="_blank"
                    >
                        Visit Website
                    </Link>
                </Button>
            </div>

            <div className="container mx-auto max-w-[85rem] flex flex-col md:flex-row justify-between mt-12 max-2xl:p-4">
                <Card className="p-5 w-full md:w-3/5 bg-gray-300/10 max-sm:mb-6">
                    <div className="text-lg">
                        <PortableText value={page.content} />
                    </div>
                </Card>
                
                <div className="space-y-6 md:space-y-10 w-full md:w-2/6 lg:w-1/3">
                    <Card className="w-full md:w-3/4 py-0">
                        <Image
                            src={page.imgurl} 
                            alt={page.title || 'Product image'} 
                            width={600}
                            height={400}
                            className="w-full h-60 rounded-sm object-cover rounded-t-xl"
                            priority
                        />
                    </Card>

                    <Card className="w-full md:w-3/4">
                        <CardHeader>
                            <CardTitle>Category</CardTitle>
                        </CardHeader>

                        <CardContent className="space-x-4">
                            {page.category?.map((category:string) => (
                                <Button 
                                    key={category}
                                    className="bg-[#409eff] hover:bg-[#409eff]/90 dark:text-white"
                                >{category}</Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="w-full md:w-3/4 gap-1 mb-4"> 
                        <CardHeader>
                            <CardTitle>website</CardTitle>
                        </CardHeader>

                        <CardContent> 
                            <Button variant="link" className="justify-start px-0" >
                                <Link href={page.website} target="_blank" rel="noopener noreferrer">{page.website}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}