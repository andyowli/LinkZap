import { Github, Mail, MoonStar, Twitter } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

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
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <div className="flex flex-col items-start gap-2 col-span-full md:col-span-2 mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                            <span className="text-lg font-bold">LinkZap</span>
                        </div>
                        <p className="text-muted-foreground text-sm m-0">LinkZap - High Quality Tool Catalog</p>
                    </div>
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="list-none p-0 space-y-2">
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
                
                <div className="flex flex-wrap justify-center gap-4">
                    <a href="https://frogdr.com/linkzap.link?utm_source=linkzap.link" target="_blank">
                        <img 
                            src="https://frogdr.com/linkzap.link/badge-white.svg" 
                            alt="Monitor&#0032;your&#0032;Domain&#0032;Rating&#0032;with&#0032;FrogDR" 
                            className="w-full max-w-62.5 h-auto max-md:w-45 md:h-13.5 mb-2"
                        />
                    </a>
                </div>

                <div className="flex justify-between">
                    <span>© {new Date().getFullYear()} LinkPage All Rights Reserved.</span>
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    );
}