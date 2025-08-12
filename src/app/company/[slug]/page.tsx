import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import { client } from "../../../sanity/client";
import { PortableText, SanityDocument } from "next-sanity";

const getPage = `*[_type == "company" && slug.current == $slug][0]{
    title,
    subtitle,
    body
}`;

console.log(getPage);

const options = { next: { revalidate: 30 } };

interface PageProps {
    params: { slug: string };
}
export default async function Company ({ params }: PageProps) {
    const { slug } = await params;
    
    const page = await client.fetch<SanityDocument>(getPage, {slug}, options);
    console.log(page);

    if (!page) {
        return <div>Page not found</div>;
    }

    return (
        <div>
            <Navbar />

            <div className="container mx-auto max-w-7xl mt-24">
                <div className="text-center mb-8">
                    <h1>{page.title}</h1>
                    <span className="text-xl text-gray-500">{page.subtitle}</span>
                </div>
                <div className="h-[0.2] bg-gray-400 mb-6"></div>
                <div className="text-lg">
                    <PortableText value={page.body} />
                </div>
            </div>

            <Footer />
        </div>
    )
}