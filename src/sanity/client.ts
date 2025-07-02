import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from "next-sanity";
// import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: "ydbd7ohj",
  dataset: "production",
  token: process.env.NEXT_PUBLIC_SANITY_USER_ADDER_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Create Image URL Generator
const builder = imageUrlBuilder(client);

// Export urlFor function
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface ImageBlock {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string; // 图片的替代文本
}