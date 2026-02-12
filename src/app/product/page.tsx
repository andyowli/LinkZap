import { client } from "../../sanity/client";
import { SanityDocument } from "next-sanity";
import ProductClient from "../../components/ProductClient";
import { POSTS_QUERY,POST_SIDEBAR, options } from "../../lib/sanityDB";
import { Navbar } from "../../components/navbar-wrapper";

// Add SEO metadata to the product list page
export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }) {
    const sidebar = await client.fetch<SanityDocument[]>(POST_SIDEBAR, {}, options);
    const category = (await searchParams)?.category;
    const categoryName = sidebar.find(item => item.title.toLowerCase() === category)?.title;
  
    const baseTitle = 'Selected product collection - High-quality tools and resources for enhancing creativity and productivity.';
    const baseDescription = 'Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity. We have carefully selected high-quality products from multiple fields such as AI, UI, design, travel, and community.';
  
    let title = baseTitle;
    let description = baseDescription;
  
    if (categoryName) {
      title = `${categoryName} Product Collection`;
      description = `Browse our curated selection of high-quality products in the ${categoryName} category to help you discover and connect with the most suitable tools and resources.`;
    }
  
    return {
      title,
      description,
      keywords: ['Product Catalog', 'Tool Collection', 'AI tools', 'Design resources', 'Productivity tools', 'Independent Creator', ...(categoryName ? [categoryName] : [])],
      openGraph: {
        type: 'website',
        title,
        description,
        url: category ? `https://www.linkzap.link/product?category=${category}` : 'https://www.linkzap.link/product',
        images: [
          {
            url: '/logo.svg',
            alt: 'Product Collection Logo',
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/logo.svg'],
      },
    };
}

const ProductPage = async ({ searchParams } : { searchParams : { category?: string, search?: string } }) => {
  const selectedCategory = (await searchParams).category;
  const searchQuery = (await searchParams).search;

  // Obtain article data
  const postsData = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  // Get sidebar data
  const sidebarData = await client.fetch<SanityDocument[]>(POST_SIDEBAR, {}, options);
  
  // Application classification filtering
  let posts = postsData;
  if (selectedCategory) {
    if (selectedCategory.toLowerCase() === "featured") {
      posts = postsData.filter(post => post.featured === true || post.featured === "true");
    } else {
      posts = postsData.filter(post =>
        Array.isArray(post.category)
          ? post.category.some(cat => cat.toLowerCase() === selectedCategory)
          : post.category?.toLowerCase() === selectedCategory
      );
    }
  }

  // Sort posts to put featured items first
  posts.sort((a, b) => {
    const aFeatured = a.featured ? 1 : 0;
    const bFeatured = b.featured ? 1 : 0;
    return bFeatured - aFeatured; // Sort in descending order, with features set to true placed first
  });

  // homePage search
  if (searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    // If the search term is' featured ', filter out the featured products
    if (query === "featured") {
      posts = posts.filter(post => post.featured === true || post.featured === "true");
    } else {
      // Otherwise, search in the title and category
      posts = posts.filter(post => {
        // Only check if the title matches exactly (ignoring capitalization)
        const title = post.title?.toLowerCase().trim();

        // check classification
        let categoryMatch = false;
        if (Array.isArray(post.category)) {
          categoryMatch = post.category.some((cat: string) => cat.toLowerCase().includes(query));
        } else if (typeof post.category === 'string') {
          categoryMatch = post.category.toLowerCase().includes(query);
        }

        return title.includes(query) || categoryMatch;
      });
    }
  }

  return (
    <>
      <Navbar />
      <ProductClient 
        posts={posts} 
        sidebar={sidebarData} 
        selectedCategory={selectedCategory} 
      />
    </>
  );
}

export default ProductPage;