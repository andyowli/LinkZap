"use client"

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Bot, PanelsTopLeft, WandSparkles, BookText, BriefcaseBusiness, Laptop, Backpack, PencilRuler, Handshake } from "lucide-react";
import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import { JSX, useEffect, useRef, useState } from "react";
import { Loading } from "@/components/loading";
import { usePathname, useSearchParams } from "next/navigation";
import { EmptyData } from "@/components/empty-data";

const POSTS_QUERY = `*[ _type == "post" && !(_id in path("drafts.**"))]{
  _id,
  title,
  "slug": slug.current,
  category,
  "imgurl":image.asset->url,
  "content":body[].children[].text
}`;

const POST_SIDEBAR = `*[_type == "sidebar"]{
  _id,
  title
}`;

const options = { next: { revalidate: 30 } };

const ProductPage = () => { 
  const [posts, setPosts] = useState<SanityDocument[]>([]);
  const [sidebar, setSidebar] = useState<SanityDocument[]>([]);

  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Ref records the last path name
  const lastPathname = useRef(pathname);
  const lastCategory = useRef(selectedCategory);

  useEffect(() => {
    if (
      lastPathname.current !== pathname ||
      (lastCategory.current && !selectedCategory)
    ) {
      setLoading(true);
      lastPathname.current = pathname;
      lastCategory.current = selectedCategory;
    }
    async function fetchData() {
      try {
        const [postsRes, sidebarRes] = await Promise.all([
          client.fetch<SanityDocument[]>(POSTS_QUERY,{},options),
          client.fetch<SanityDocument[]>(POST_SIDEBAR,{},options)
        ]);
        setPosts(postsRes);
        setSidebar(sidebarRes);
      } catch (error) {
        if(error) {
          setPosts([]); 
          setSidebar([]);

          return <EmptyData />
        }
      }
      
      setLoading(false);

      lastPathname.current = pathname;
      lastCategory.current = selectedCategory;
    }
    fetchData();
  }, [pathname,selectedCategory]);

  const orderedSidebar = [...sidebar].reverse();

  console.log(orderedSidebar);

  if (loading) {
    return <Loading />;
  }

  const filteredPosts = selectedCategory
  ? posts.filter(post =>
      Array.isArray(post.category)
        ? post.category.some(
            c => c && c.toLowerCase() === selectedCategory.toLowerCase()
          )
        : post.category && post.category.toLowerCase() === selectedCategory.toLowerCase()
    )
  : posts;

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
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="pt-24">
        <div className="flex items-center justify-center flex-col mb-8">
          <h1 className="font-bold text-balance text-2xl sm:text-3xl md:text-4xl">
            Your Ultimate
            <span className="text-blue-500"> Directory of Directories</span>
          </h1>
          <p className="max-w-3xl text-balance text-muted-foreground sm:text-xl">Iscover the best catalog and easily launch your products</p>
        </div>
        
        <div className="pb-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                  <h2 className="text-lg font-bold mb-4">Categories</h2>
                  <div className="space-y-1">
                    {orderedSidebar.map((title) => (
                      <Link
                        key={title._id}
                        href={`/product?category=${title.title.toLowerCase()}`}
                        className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        // onClick={() => setSelectedCategory(title.title)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">               
                  {filteredPosts.map((post) => (
                      <Link href={`/${post.slug}`} key={post._id}>
                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="flex justify-between items-start">
                            <div className="w-full">
                              <div>
                                <img
                                  src={post.imgurl}
                                  alt={post.title}
                                  className="object-cover w-full h-44"
                                />
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <h4 className="text-blue-400 mb-2.5">{post.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                          </CardContent>
                        </Card>
                      </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white border-t">
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
  )
}

export default ProductPage;