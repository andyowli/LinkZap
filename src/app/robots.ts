import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/dl'],  // allow
            },
        ],
        sitemap: 'https://linkzap.link/sitemap.xml'
    };
}