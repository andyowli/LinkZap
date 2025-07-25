import { Github, Mail, MoonStar, Twitter } from "lucide-react";

type FooterLink = {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

export function Footer() {
    const sections = [
        {
            title: 'Product',
            links: [
                { name: 'Product', href: '/product' },
                { name: 'Tools', href: '/product?category=tools' }
            ],
        },
        {
            title: 'Resources',
            links: [
                { name: 'Blog', href: '/blog' },
                { name: 'Price', href: '/price' },
                { name: 'Submit', href: '/submit' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'Privacy Policy', href: '/company/Privacy' },
                { name: 'Terms of Service', href: '/company/Terms' },
            ],
        },
        {
            title: 'Social',
            links: [
                { name: 'Twitter', href: '#', icon: <Twitter /> },
                { name: 'Github', href: '#', icon: <Github />  },
                { name: 'Email', href: '#', icon: <Mail /> },
            ] as FooterLink[]
        },
    ];

    return (
        <footer className="py-10 container mx-auto max-w-7xl">
            <div className="">
                <div className="mb-8">
                    <div className="flex items-center">
                        
                        <span className="text-xl font-bold">LinkZap</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="list-none p-0">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="mb-4 flex items-center">
                                        {link.icon && (
                                            <span className="mr-2">
                                                {link.icon}
                                            </span>
                                        )}
                                        <a href={link.href}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="h-[0.2] bg-gray-400 mb-6"></div>

                <div className="flex justify-between">
                    <span>© 2025 LinkPage All Rights Reserved.</span>
                    <MoonStar />
                </div>
            </div>
        </footer>
    );
}