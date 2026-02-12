import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '../../../lib/stripe';

export async function POST(request: Request,res: Response) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        if (!origin) {
            return NextResponse.json(
                { error: 'Origin header is missing' },
                { status: 400 }
            );
        }

        const { priceId } = await request.json();


        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price: priceId,
                    quantity: 1,
                },
            ],
            // Allow users to enter promotional codes within it
            allow_promotion_codes: true,
            mode: 'payment',
            success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        });
        return NextResponse.json({ url: session.url })
    } catch (err) {
        // Check if err is an Error instance
        if (err instanceof Error) {
            return NextResponse.json(
                { error: err.message },
                { status: (err as any).statusCode || 500 }
            );
        }

        // If it is not an Error instance, return a generic error message
        return NextResponse.json(
            { error: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}