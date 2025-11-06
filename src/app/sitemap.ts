import { MetadataRoute } from 'next';
import { client } from '../sanity/client';

async function getProducts() {
    const query = `*[_type == "post"]{ slug { current } }`;
    return client.fetch(query);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts();
    const productEntries = products.map((product: any) => ({
        url: `https://www.linkzap.link/${product.slug.current}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: 'https://www.linkzap.link',
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        { 
            url: 'https://www.linkzap.link/product', 
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        { 
            url: 'https://www.linkzap.link/price', 
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        ...productEntries,
    ];
}