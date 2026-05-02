import { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ClientOnly from "../components/ClientOnly";
import { Toaster } from '../components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

export const metadata: Metadata = {
  // Basic Information
  title: {
    template: '%s | LinkZap',
    default: 'Resources to Skyrocket Your Creative Edge.',
  },
  description: 'Handpicked, proven tools and intelligent resources designed to help independent creators achieve exponential gains in creativity, efficiency, and real-world output.',
  keywords: ['Product Catalog', 'Tool Collection', 'AI tools', 'Design resources', 'Productivity tools', 'Independent Creator'],
  creator: 'LinkZap Team',
  publisher: 'LinkZap',
  
  // Icon settings
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
  
  metadataBase,

  // share
  openGraph: {
    type: 'website',
    title: 'Resources to Skyrocket Your Creative Edge.',
    description: 'Handpicked, proven tools and intelligent resources designed to help independent creators achieve exponential gains in creativity, efficiency, and real-world output.',
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
    title: 'Resources to Skyrocket Your Creative Edge.',
    description: 'Handpicked, proven tools and intelligent resources designed to help independent creators achieve exponential gains in creativity, efficiency, and real-world output.',
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
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientOnly>
            <ThemeProvider 
              attribute="class" 
              defaultTheme="light" 
              enableSystem 
              scriptProps={{ type: "application/json" }}
            >
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </ClientOnly>
        </body>
      </html>
  );
}
