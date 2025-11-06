import { Github, Mail, MoonStar, Twitter } from "lucide-react";
import Image from "next/image";

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
                { name: 'Twitter', href: 'https://x.com/yuwensuotuo', icon: <Twitter /> },
                { name: 'Github', href: 'https://github.com/andyowli', icon: <Github />  },
                { name: 'Email', href: 'mailto:kissfish1376@163.com', icon: <Mail /> },
            ] as FooterLink[]
        },
    ];

    return (
        <footer className="py-10 container mx-auto max-w-7xl max-sm:px-4 px-6">
            <div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8">
                    <div className="flex items-start gap-2">
                        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                        <span className="text-xl font-bold mt-1.5">LinkZap</span>
                    </div>
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