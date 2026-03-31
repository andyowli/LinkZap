import { neon } from '@neondatabase/serverless';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cache } from 'react';

// 异步获取数据库 client
export async function getDb() {
    const { env } = await getCloudflareContext({ async: true });

    const connectionString = (env as any).NEXT_PUBLIC_NEON_CONNECTION_STRING 
        || process.env.NEXT_PUBLIC_NEON_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error('NEON_CONNECTION_STRING is not configured');
    }

    return neon(connectionString);
}