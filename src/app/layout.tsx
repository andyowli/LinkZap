import { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import ClientOnly from "../components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic Information
  title: {
    template: '%s | LinkZap',
    default: 'Selected product collection - High-quality tools and resources for enhancing creativity and productivity.',
  },
  description: 'Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity. We have carefully selected high-quality products from multiple fields such as AI, UI, design, travel, and community.',
  keywords: ['Product Catalog', 'Tool Collection', 'AI tools', 'Design resources', 'Productivity tools', 'Independent Creator'],
  creator: 'LinkZap Team',
  publisher: 'LinkZap',
  
  // Icon settings
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
  
  // share
  openGraph: {
    type: 'website',
    title: 'Selected product collection - High-quality tools and resources for enhancing creativity and productivity.',
    description: 'Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity. We have carefully selected high-quality products from multiple fields such as AI, UI, design, travel, and community.',
    url: 'https://www.linkzap.link',
    siteName: 'LinkZap',
    images: [
      {
        url: '/logo.svg',
        alt: 'LinkZap - Logo',
        width: 1200,
        height: 630,
      },
    ],
  },
  
  // Twitter 
  twitter: {
    card: 'summary_large_image',
    title: 'Selected product collection - High-quality tools and resources for enhancing creativity and productivity.',
    description: 'Discover and connect high-quality tools and resources to help independent creators achieve a leap in creativity and productivity. We have carefully selected high-quality products from multiple fields such as AI, UI, design, travel, and community.',
    images: ['/logo.svg'],
    site: '@LinkZap',
    creator: '@LinkZapTeam',
  },
  // Content security policy (optional)
  other: {
    'content-security-policy': 'default-src https:; script-src https: \'unsafe-inline\'; style-src https: \'unsafe-inline\'; img-src https: data:',
  },
};

// For Next.js versions that support generateViewport, you can also set the viewport individually
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientOnly>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              {children}
            </ThemeProvider>
          </ClientOnly>
        </body>
      </html>
    </ClerkProvider>
  );
}
