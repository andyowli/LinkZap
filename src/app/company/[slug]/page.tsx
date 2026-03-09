import { EmptyData } from "../../../components/empty-data";
import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar-wrapper";
import { client } from "../../../sanity/client";
import { PortableText, SanityDocument } from "next-sanity";
import Banner from "../../../components/banner";

const getPage = `*[_type == "company" && slug.current == $slug][0]{
    title,
    subtitle,
    body
}`;

const options = { next: { revalidate: 30 } };

interface PageProps {
    params: Promise<{ slug: string }>;
}
export default async function Company ({ params }: PageProps) {
    const { slug } = await params;
    
    const page = await client.fetch<SanityDocument>(getPage, {slug}, options);
    console.log(page);

    if (!page) {
        return (
            <div className="flex flex-col min-h-screen">
                <Banner />

                <Navbar topClass="top-10"/>

                <main className="flex-1 flex items-center justify-center">
                    <EmptyData />
                </main>

                <Footer />
            </div>
        )
    }

    return (
        <div>
            <Banner />

            <Navbar topClass="top-10"/>

            <div className="container mx-auto max-w-7xl mt-24">
                <div className="text-center mb-8">
                    <h1>{page.title}</h1>
                    <span className="text-xl text-gray-500">{page.subtitle}</span>
                </div>
                <div className="h-[0.2] bg-gray-400 mb-6"></div>
                <div className="text-lg p-8">
                    <PortableText value={page.body} />
                </div>
            </div>

            <Footer />
        </div>
    )
}