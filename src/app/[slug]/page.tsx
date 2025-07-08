import { EmptyData } from "@/components/empty-data";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/sanity/client";
import { PortableText, SanityDocument } from "next-sanity";
import Link from "next/link";

const getPage = `*[ _type == "post" && slug.current == $slug][0]{
    _id,
    "imgurl":image.asset->url,
    "content":body,
    website,
    category
}`;

const options = { next: { revalidate: 30 } };

interface PageProps {
  params: { slug: string };
}


const Page = async({ params }: PageProps) => {
    const { slug } = await params;

    const page = await client.fetch<SanityDocument>(getPage, {slug}, options);
    console.log(page);

    if (!page) {
        return (
            <div>
                <Navbar />
                <EmptyData />
            </div>
        );
    }


    return (
        <div>
            <Navbar />

            <div className="container mx-auto max-w-[85rem] flex flex-col md:flex-row justify-between mt-16">
                <div className="p-8 w-full md:w-3/5">
                    <div className="text-lg">
                        <PortableText value={page.content} />
                    </div>
                </div>
                
                <div className="mt-8 md:mt-12 space-y-6 md:space-y-10 w-full md:w-2/5 lg:w-1/3">
                    <Card className="w-full md:w-3/4 py-0">
                        <img 
                            src={page.imgurl} 
                            alt={page.title} 
                            className="w-full h-60 rounded-sm object-cover" 
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
                                    className="bg-[#409eff] hover:bg-[#409eff]/90"
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
                                <Link href={page.website} target="_blank">{page.website}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page;