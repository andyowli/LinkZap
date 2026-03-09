'use client'

import React, { useState, useEffect } from 'react';
import { client } from '../sanity/client';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

interface BannerItem  {
    title?: string;   
    imgurl?: string;    
    iconurl?: string;  
    webUrl?:string,   
    banner?: boolean;
}

const BANNER_VISIBILITY_EVENT = 'banner:visibility';

const Banner: React.FC = () => {
    const [bannerItems, setBannerItems] = useState<BannerItem[]>([]); // Store multiple banner items
    const [isPaused, setIsPaused] = useState(false); // Control whether the animation pauses or not

    useEffect(() => {
        const notifyVisibility = (visible: boolean) => {
            if (typeof window === 'undefined') return;
        
            window.dispatchEvent(
                new CustomEvent<{ visible: boolean }>(BANNER_VISIBILITY_EVENT, {
                    detail: { visible },
                })
            );
        };

        const fetchData = async () => {
            const query = `*[_type == "post" && banner == true]{
                title,
                "webUrl": website,
                "iconurl":icon.asset->url,
                banner
            }`;
            const options = { next: { revalidate: 10 } };

            try {
                const data = await client.fetch(query,{}, options);
                setBannerItems(data); 
                notifyVisibility(Array.isArray(data) && data.length > 0);
            } catch (error) {
                console.error('Failed to fetch banner data:', error);
                notifyVisibility(false);
            }
        };

        fetchData();

        // When the component is unmounted, ensure the navigation returns to the top
        return () => {
            notifyVisibility(false);
        };
    }, []);

    // If there is no banner data, do not display the component
    if (!bannerItems || bannerItems.length === 0) return null;

    // Determine whether to enable scrolling animation with a length greater than 1
    const shouldScroll = bannerItems.length > 1;

    console.log('Items:', bannerItems);

    return (
        <div className="sticky top-0 whitespace-nowrap w-full h-10  text-center bg-gradient-to-r from-blue-50 via-green-50 to-orange-50 z-20">
            {/* Determine whether to add scrolling animation based on should Scroll*/}
            <div className={`flex items-center justify-center w-full h-full ${shouldScroll ? 'animate-scroll-left' : ''} ${
                    isPaused ? 'paused' : ''
                }`}
                onMouseEnter={() => setIsPaused(true)} // Move the mouse in to pause the animation
                onMouseLeave={() => setIsPaused(false)} // Move the mouse out to restore animation
            >
                <div className='w-full flex items-center justify-center gap-1'>
                    {bannerItems.map((item, index) => (
                        <div key={`original-${index}`} className="flex items-center gap-2 mx-4">
                            <Link 
                                href={item.webUrl ?? ''}
                                target='_blank'
                                className='flex items-center gap-2'
                            >
                                <Image
                                    src={item.iconurl ?? ''} 
                                    alt={item.title ?? 'banner'} 
                                    width={30} 
                                    height={30}
                                />
                                <span className='dark:text-black'>sponsored by {item.title}</span>
                                <MoveRight className='dark:text-black'/>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;