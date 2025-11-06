"use client"
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import JSConfetti from 'js-confetti';
import Link from "next/link";
import useFormData from "@/store/formData";
import usePrice from "@/store/priceCount";

export default function SuccessPage() {
    const {data:formData} = useFormData();
    const {price} = usePrice();

    const hasUploaded = useRef(false);


    useEffect(() => {
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti()
    }, [])

    useEffect(() => {
        const uploadData = async () => {
            // Retrieve data from the store
            const storedData = useFormData.getState().data;
            
            if (!storedData.title || !storedData.slug || !storedData.website || !storedData.tag) {
                console.error('Missing required fields:', storedData);
                return;
            }
            
            const formDataUpload = new FormData();
            formDataUpload.append('title', storedData.title);
            formDataUpload.append('slug', storedData.slug);
            formDataUpload.append('website', storedData.website);
            formDataUpload.append('category', storedData.tag);

            const tags = storedData.tag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            tags.forEach(tag => {
                formDataUpload.append('category', tag);
            });

            // Convert from base64 back to File object (if File object is lost)
            let fileToUpload: File | null = null;
            if (storedData.image instanceof File && storedData.image.size > 0) {
                fileToUpload = storedData.image;
            } else if (storedData.imageBase64) {
                // Create a File object from a base64 string
                const byteString = atob(storedData.imageBase64.split(',')[1]);
                const mimeString = storedData.imageBase64.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                fileToUpload = new File([blob], `image.${mimeString.split('/')[1]}`, { type: mimeString });
            }
            
            if (fileToUpload) {
                formDataUpload.append('file', fileToUpload);
            } else {
                console.error('No image found for upload');
            }

            let iconToUpload: File | null = null;
            if (storedData.icon instanceof File && storedData.icon.size > 0) {
                iconToUpload = storedData.icon;
            } else if (storedData.iconBase64) {
                // Create a File object from a base64 string
                const byteString = atob(storedData.iconBase64.split(',')[1]);
                const mimeString = storedData.iconBase64.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                iconToUpload = new File([blob], `icon.${mimeString.split('/')[1]}`, { type: mimeString });
            }

            if (iconToUpload) {
                formDataUpload.append('icon', iconToUpload);
            } else {
                console.error('No icon found for upload');
            }

            formDataUpload.append('description', storedData.description);

            if (price === 9.9) {
                formDataUpload.append('featured', 'true');
            }
            
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });
                console.log('Upload response:', await res.json());
            
                // Clear store data after successful upload
                useFormData.getState().clearFormData?.();
            } catch (error) {
                console.error("Error uploading data:", error);
            }
        };

        // Upload only when necessary data has not been uploaded before
        if (!hasUploaded.current && formData?.title) {
            hasUploaded.current = true;
            uploadData();
        }
    }, [formData, price]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />



            <div className="flex-grow flex items-center justify-center">
                <Card className="max-w-3xl w-full mx-4 p-6 text-center flex items-center">
                    <div className="rounded-full w-17 h-17 bg-[#e7edff] flex items-center justify-center">
                        <div className="rounded-full w-14 h-14 bg-[#409eff] flex items-center justify-center">
                            <Check className="size-8 text-white"/>
                        </div>
                    </div>
                    <div>
                        <p>Form submitted successfully!</p>
                        <p className="text-sm text-gray-400">Thank you for your payment. You will see the content you have posted in the product.</p>
                    </div>
                    <div>
                        <Button className="bg-[#409eff] hover:bg-[#409eff]/90">
                            <Link href="/product">
                                View products
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>

            <Footer /> 
        </div>
    )
}