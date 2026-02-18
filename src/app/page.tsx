import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar-wrapper";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { client } from "../sanity/client";
import { Search } from "lucide-react";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  slug: string;
  category: Array<string>;
  imgurl: string;
  content: string;
  webUrl?: string;
  featured: boolean;
};

const POSTS_QUERY = `*[ _type == "post" && !(_id in path("drafts.**"))]{
  _id,
  title,
  "slug": slug.current,
  category,
  "imgurl":image.asset->url,
  "webUrl": website,
  featured,
  "content":body[].children[].text
}`;

const options = { next: { revalidate: 10 } };

export default async function Home() {
  const PSOT_CARD_RAW = await client.fetch<SanityDocument[]>(POSTS_QUERY,{}, options);

  // 映射为 Post 类型
  const PSOT_CARD: Post[] = PSOT_CARD_RAW.map((doc) => ({
    _id: doc._id,
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    imgurl: doc.imgurl,
    webUrl: doc.webUrl,
    featured: doc.featured,
    content: Array.isArray(doc.content) ? doc.content.join(" ") : doc.content,
  }));

  // Extract Featured Articles
  const featuredPosts = PSOT_CARD.filter(post => post.featured);
  const limitedFeaturedPosts = featuredPosts.slice(0, 6);

  // Remove Featured articles from raw data to avoid duplicate grouping
  const nonFeaturedPosts = PSOT_CARD.filter(post => !post.featured);


  // group by category
  // const groupedPosts = PSOT_CARD.reduce((acc: Record<string, Post[]>, post) => {
  //   post.category.forEach((category: string | number) => {
  //     if (!acc[category]) acc[category] = [];
  //     acc[category].push(post);
  //   });
  //   return acc;
  // }, {} as Record<string, Post[]>);

  const groupedPosts = nonFeaturedPosts.reduce((acc: Record<string, Post[]>, post) => {
    post.category.forEach((category: string | number) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(post);
    });
    return acc;
  }, {} as Record<string, Post[]>);

  // Build the final classification object
  const limitedGroupedPosts = {} as Record<string, Post[]>;
  const seenPosts = new Set<string>(); // used to track content that has already been added

  // Add Featured Categories
  limitedGroupedPosts["Featured"] = limitedFeaturedPosts;

  const categories = Object.keys(groupedPosts).slice(0, 2); // only select the first 4 groups
  const allCategories = ["Featured", ...categories];

  allCategories.forEach(category => {
    if (category === "Featured") {
      // 直接赋值 Featured 文章
      limitedGroupedPosts[category] = limitedFeaturedPosts;
    } else {
      // Security Handling Other Categories
      const postsInCategory = groupedPosts[category] || []; // If it does not exist, it defaults to an empty array
      let count = 0;
      limitedGroupedPosts[category] = [];
  
      for (const post of postsInCategory) {
        if (!seenPosts.has(post._id) && count < 6) {
          limitedGroupedPosts[category].push(post);
          seenPosts.add(post._id);
          count++;
        }
  
        if (count >= 6) break;
      }
    }
  });

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Category Zone */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-balance leading-tight">
            <span className="block sm:inline">Discover Resources</span>{' '}
            <span className="block sm:inline">That Elevate Creativity</span>
          </h1>
          <p className="sm:text-xl text-muted-foreground text-balance max-w-4xl mx-auto">
            Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-4 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="relative">
            <form action="/product" method="GET">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                autoComplete="off"
                placeholder="Please enter product title or category"
                className="w-full pl-12 pr-4 py-6 rounded-full text-base sm:text-md md:text-lg shadow-sm border-muted focus-visible:ring-[2px] focus-visible:ring-blue-500"
              />
            </form>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {Object.entries(limitedGroupedPosts).map(([category, posts]) => (
        <section className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl max-sm:text-md font-bold capitalize">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post:Post) => (
                  <Card 
                    key={post._id} 
                    className="relative py-0 transition-all hover:shadow-md hover:scale-[1.02] max-sm:h-60"
                  >

                    {/* Content below the image */}
                    <CardHeader className="p-0 max-h-[500px]">
                      <div className="w-full relative overflow-hidden h-[238px] group">
                        <Image 
                          src={post.imgurl}
                          alt={post.title}
                          fill
                          unoptimized
                          className="rounded-t-xl max-sm:rounded-xl object-cover"
                        />
                        {/* Mask Overlay */}
                        <a 
                          href={post.webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-md font-medium flex items-center justify-center"
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                            Visit Website
                          </div>
                        </a>
                      </div>
                    </CardHeader>
                    <CardContent className="w-full px-4 mt-[-4] max-sm:absolute max-sm:bottom-0 max-sm:bg-gray-900/70 max-sm:text-white">
                      <Link href={`/${post.slug}`}>
                        <h3 className="m-0 font-semibold text-lg mt-2 mb-2 text-blue-400">{post.title}</h3>
                        <div className="mt-[-.5rem]">
                          <p className="text-sm text-muted-foreground line-clamp-2 max-sm:text-white/80 mb-4">{post.content}</p>
                        </div>
                        <div className="relative mt-12">
                          <div className="absolute bottom-4 right-0">
                            {post.category.map((category,index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="bg-blue-500 text-white ml-2 first:ml-0"
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/product">View all resources</Link>
              </Button>
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <Footer />
    </main>
  );
}
