import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/hl'],  // allow
            },
        ],
        sitemap: 'https://linkzap.link/sitemap.xml'
    };
}