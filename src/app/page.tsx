import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { client } from "@/sanity/client";
import { Search } from "lucide-react";
import { SanityDocument } from "next-sanity";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  slug: string;
  category: Array<string>;
  imgurl: string;
  content: string;
};

const POSTS_QUERY = `*[ _type == "post" && !(_id in path("drafts.**"))]{
  _id,
  title,
  "slug": slug.current,
  category,
  "imgurl":image.asset->url,
  "content":body[].children[].text
}`;

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const PSOT_CARD = await client.fetch<SanityDocument>(POSTS_QUERY,{}, options);


  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="h-11 text-4xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Selected resources , empower creativity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-4 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="searching resources..."
              className="w-full pl-12 pr-4 py-6 rounded-full text-base shadow-sm border-muted"
            />
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Editors Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PSOT_CARD.map((post:Post) => (
              <Link href={`/${post.slug}`} key={post._id}>
                <Card key={post._id} className="py-0 gap-1.5 transition-all hover:shadow-md hover:scale-[1.02]">
                {/* Image takes up full width */}
                <div className="relative w-full h-48 bg-muted rounded-t-xl">
                  <img 
                    src={post.imgurl}
                    alt={post.title}
                    className="w-full h-full rounded-t-xl"
                  />
                </div>

                {/* Content below the image */}
                <CardHeader>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                </CardContent>
                <CardFooter className="pb-6 flex justify-end">
                  {post.category.map((category,index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-blue-500 text-white ml-2 first:ml-0"
                    >
                      {category}
                    </Badge>
                  ))}
                </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/product">View all resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">© 2025 Product Collection</div>
            <div className="flex space-x-6">
              <Link href="/standards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Inclusion criteria
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
