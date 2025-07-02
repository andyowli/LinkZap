// app/api/upload/route.js
import { client } from '../../../sanity/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request:NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const slug = formData.get('slug');
        const website = formData.get('website');
        const category = formData.getAll('category'); // 获取所有分类
        const description = formData.get('description') as string; // 获取文本

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

        // 上传图片
        if (!(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'Invalid file type' }, 
                { status: 400 }
            );
        }
        const imageAsset = await client.assets.upload('image', file as Blob, {
            filename: (file as File).name || 'uploaded-image',
        });


        // 创建 post 类型文档
        const newPost = {
            _type: 'post', // 与查询 *[_type == "post"] 匹配
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

        const result = await client.create(newPost); // 创建命令

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