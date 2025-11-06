"use client"

import { Navbar } from "@/components/navbar";
import CheckoutPage from "../../components/checkoutPage";
import converToSubcurrency from "../../lib/converToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Footer } from "@/components/footer";
import { useParams } from "next/navigation";
import usePrice from "@/store/priceCount";

if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined){
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const { price } = usePrice();
    const amount = price;

    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            mode: "payment",
                            amount: converToSubcurrency(amount),
                            currency: "usd",
                        }}
                    >
                        <CheckoutPage amount={amount} />
                    </Elements>
                </div>
            </div>

            <Footer />
        </main>
    )
}