import { Navbar } from "@/components/navbar";
import ResourceCard from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const resources = [
    {
      id: 1,
      name: "Figma",
      description: "专业的在线协作设计工具",
      category: "设计素材",
      icon: "/placeholder.svg?height=200&width=400&text=Figma",
    },
    {
      id: 2,
      name: "VS Code",
      description: "强大的代码编辑器，支持多种编程语言",
      category: "开发工具",
      icon: "/placeholder.svg?height=200&width=400&text=VS+Code",
    },
    {
      id: 3,
      name: "Notion",
      description: "集笔记、知识库、项目管理于一体的协作平台",
      category: "效率办公",
      icon: "/placeholder.svg?height=200&width=400&text=Notion",
    },
    {
      id: 4,
      name: "Vercel",
      description: "前端应用部署平台，支持自动化部署",
      category: "开发工具",
      icon: "/placeholder.svg?height=200&width=400&text=Vercel",
    },
    {
      id: 5,
      name: "Unsplash",
      description: "高质量免费图片资源库",
      category: "设计素材",
      icon: "/placeholder.svg?height=200&width=400&text=Unsplash",
    },
    {
      id: 6,
      name: "MDN Web Docs",
      description: "权威的Web开发文档和学习资源",
      category: "学习资源",
      icon: "/placeholder.svg?height=200&width=400&text=MDN",
    },
  ]


  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="h-11 text-4xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Selected resources , empower creativity001
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-12 px-4">
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
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Editors Picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/all-resources">View all resources</Link>
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
