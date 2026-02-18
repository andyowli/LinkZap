import { Metadata } from 'next';
import { client } from '../../sanity/client';
import { Card } from '../../components/ui/card';

// Static metadata: noidex+follow (supported by NextJS 16)
export const metadata: Metadata = {
    robots: {
        index: false,       // Prohibit indexing the page itself
        follow: true,       // Allow following links on the page
        googleBot: {
            index: false,
            follow: true,
        },
    },
    // Set null value to avoid warnings
    title: '',
    description: '',
};

export default async function HiddenLinksPage() {
    const query = `
        *[_type == "post" ] | order(_createdAt desc){
            "webUrl": website,
            "slug": slug.current,
            "anchorText":title
        }
    `;

    const paidLinks = await client.fetch(query);

    // If there is no link, return empty directly
    if (!paidLinks?.length) {
        return null;
    }

    return (
        <div >
            <h1 style={{ display: 'none' }}>Reference Links</h1>

            <div className="flex flex-wrap gap-4 p-4">
                {paidLinks.map((link: { webUrl: string; anchorText: string }, index: number) => (
                    <Card
                        key={index}
                        className="w-fit min-w-min p-4 cursor-pointer"
                    >
                        <a
                            href={link.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"  // Stay safe
                            // add a title attribute to increase naturalness
                            title={link.anchorText || 'Reference'}
                        >
                            {link.anchorText || link.webUrl}
                        </a>
                    </Card>
                ))}
            </div>
        </div>
    );
}