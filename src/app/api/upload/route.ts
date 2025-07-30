import { client } from '../../../sanity/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request:NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const slug = formData.get('slug');
        const website = formData.get('website');
        const category = formData.getAll('category'); // get classification
        const description = formData.get('description') as string; // get text

        let body = [];
        try {
            body = JSON.parse(description);
        } catch {
            body = [];
        }

        console.log('text',description);


        if (!file || !title || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        // upload pictures
        if (!(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'Invalid file type' }, 
                { status: 400 }
            );
        }
        const imageAsset = await client.assets.upload('image', file as Blob, {
            filename: (file as File).name || 'uploaded-image',
        });


        // Create a sanity post type document
        const newPost = {
            _type: 'post',
            title,
            slug: {
                _type: 'slug',
                current: slug,
            },
            image: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id,
                },
            },
            website,
            category:category.length > 0 ? category : null ,
            body,
            publishedAt: new Date().toISOString(),
        }

        const result = await client.create(newPost); // create content for sanity

        return NextResponse.json({
            message: 'Post created successfully',
            postId: result._id,
            imageId: imageAsset._id,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}