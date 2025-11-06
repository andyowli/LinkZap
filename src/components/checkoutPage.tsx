"use client"

import { useState,useEffect } from 'react';
import {
    useStripe,
    useElements, 
    PaymentElement
} from '@stripe/react-stripe-js';
import converToSubcurrency from '@/lib/converToSubcurrency';
import { set } from 'react-hook-form';
import { Loading } from './loading';
const CheckoutPage = ({amount}:{amount:number}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: converToSubcurrency(amount),
            })
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }, [amount]);

    useEffect(() => {
        if (clientSecret && !showButton) {
            const timer = setTimeout(() => {
                setShowButton(true);
            }, 1500); // 延迟 1.5 秒

            return () => clearTimeout(timer); // 清理定时器
        }
    }, [clientSecret, showButton]);

    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error:submitError } = await elements.submit();

        if(submitError){
            setErrorMessage(submitError.message || "An unknown error occurred.");
            setIsLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:3000/payment-success',
            },
        });

        if(error) {
            setErrorMessage(error.message);
        }

        setIsLoading(false);
    }

    if(!clientSecret || !stripe || !elements) {
        return (
            <Loading />
        )
    }

    return (
        <form onSubmit={handleSubmit} className='bg-white dark:bg-black'>
            {clientSecret && <PaymentElement />}

            {errorMessage && <div>{errorMessage}</div>}

            {showButton && (
                <button
                    disabled={!stripe || isLoading}
                    className='w-full rounded-md bg-blue-600 text-white px-4 py-2 mt-4 hover:bg-blue-700 disabled:bg-gray-400'
                >
                    Pay
                </button>
            )}
        </form>
    )
}

export default CheckoutPage;