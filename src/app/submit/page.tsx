"use client"

import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { cn } from "../../lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import Tiptap from "../../components/editor/Tiptap";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UploadImage from "../../components/upload-image";
import { useRouter } from "next/navigation";
import { Footer } from "../../components/footer";
import useFormData from "../../store/formData";
import { createAuthClient } from "better-auth/client";
import { NavbarClient } from "../../components/navbar-client";
import { toast } from "sonner";

const frameworks = [
    {
        value: "ai",
        label: "AI",
    },
    {
        value: "image",
        label: "Image",
    },
    {
        value: "video",
        label: "Video",
    },
    {
        value: "design",
        label: "Design",
    }, 
    {
        value: "work",
        label: "Work",
    }, 
    {
        value: "tools",
        label: "Tools",
    }, 
    {
        value: "travel",
        label: "Travel",
    }, 
    {
        value: "business",
        label: "Business",  
    }
]

type TiptapMark = { type: string; attrs?: { href?: string } };
type TiptapContent = {
    type?: string;
    attrs?: { level?: number };
    content?: Array<{
        text?: string;
        marks?: TiptapMark[];
        content?: Array<{
            text?: string;
            marks?: TiptapMark[];
        }>;
    }>;
};


const Submit = () => {
    const router = useRouter();
    const authClient = createAuthClient();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ id: string; name?: string | null; email?: string | null; image?: string | null } | null>(null);

    const [open, setOpen] = React.useState(false)
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

    // Check if the user has logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await authClient.getSession();
                if (session?.data?.session) {
                    setIsAuthenticated(true);
                    // The better auth client may return different structures, try multiple possibilities
                    const userData = (session.data as any).user || (session.data.session as any)?.user || null;
                    if (userData) {
                        setUser({
                            id: userData.id,
                            name: userData.name,
                            email: userData.email,
                            image: userData.image,
                        });
                    }
                } else {
                    // Not logged in, redirected to login page
                    router.push('/sign-in?callbackUrl=/submit');
                }
            } catch (error) {
                toast.error("Failed to check login status.");
                router.push('/sign-in');
            }
        };

        checkAuth();
    }, [router]);

    const formSchema = z.object({
        title: z
        .string({ message: "Title cannot be empty" })
        .nonempty({ message: "Title cannot be empty" })
        .min(5, { message:"Title is not long enough" })
        .max(50, { message: "Title is too long" }),

        slug: z
        .string()
        .nonempty({ message: "Slug cannot be empty" })
        .max(50, { message: "Slug is too long" }),

        website: z
        .string()
        .nonempty({ message: "Website cannot be empty" })
        .url({ message: "Please enter a valid URL" })
        .max(50, { message: "Website is too long" }),

        tag: z
        .string()
        .nonempty({ message: "Tag cannot be empty" }),

        image: z
        .instanceof(File),

        icon: z
        .instanceof(File),

        description: z
        .string()
        .nonempty({ message: "Description cannot be empty" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange", 
        defaultValues: {
            title:"",
            slug: "",
            website: "",
            tag: "",
            image: undefined,
            icon: undefined,
            description: "",
        }
    })


    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!data.title || !data.slug || !data.website || !data.tag || !data.image) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Convert image files to base64 strings for persistent storage
        const fileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
        };
        
        try {
            // First, save the form data to ensure that it has been saved
            useFormData.getState().setFormData({
                ...data,
                image: data.image, // Keep file references (current session only)
                icon: data.icon, // Keep file references (current session only)
            });

            // Asynchronous conversion of files to base64 (without blocking subsequent processes)
            Promise.all([
                fileToBase64(data.image),
                data.icon ? fileToBase64(data.icon) : Promise.resolve('')
            ]).then(([base64Image, base64Icon]) => {
                // Save base64 string (persistent)
                useFormData.getState().setImageBase64(base64Image, base64Icon);
            }).catch((error) => {
                console.error('Error converting file to base64:', error);
                // 不阻止流程继续，因为文件引用已保存
            });

            const getPrice = localStorage.getItem('price-storage');
            
            if(!getPrice){
                router.push('/price');
            } else {
                const priceId = localStorage.getItem('selected-price-id');

                // Create a payment session
                const response = await fetch('/api/checkout_sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        priceId: priceId,
                    })
                });

                if (!response.ok) {
                    toast("Event has been created.")
                    return;
                }

                const result = await response.json();

                if (result.url) {
                    // Jump to Stripe payment page
                    window.location.href = result.url;
                } else {
                    toast.error("Failed to create payment session. Please try again.")
                }
            }
        } catch (error) {
            toast.error("Failed to process form. Please try again.")
        }
    }

    function randomKey() {
        return Math.random().toString(36).substr(2, 10);
    }

    // Convert Tiptap JSON to Portable Text
    function tiptapToPortableText(tiptapJson: { content?: TiptapContent[] }): unknown[] {
        if (!tiptapJson || !tiptapJson.content) return [];
        const markDefs: Array<{ _key: string; _type: string; href: string }> = [];

        function getMarks(marks?: TiptapMark[]): (string | null)[] {
            let markKey = 0;

            if (!marks) return [];
            return marks.map((mark: any) => {
                if (mark.type === 'bold') return 'strong';
                if (mark.type === 'italic') return 'em';
                if (mark.type === 'link') {
                    // Generate a unique key
                    const key = `link${markKey++}`;
                    markDefs.push({
                        _key: key,
                        _type: 'link',
                        href: mark.attrs.href,
                    });
                    return key;
                }
                return null;
            }).filter(Boolean);
        }

        return tiptapJson.content.flatMap((block: any) => {
            // paragraph
            if (block.type === 'paragraph') {
                return {
                    _type: 'block',
                    _key: randomKey(),
                    style: 'normal',
                    markDefs: [],
                    children: block.content
                        ? block.content.map((child: any) => ({
                            _type: 'span',
                            _key: randomKey(),
                            text: child.text || '',
                            marks: getMarks(child.marks),
                        }))
                        : [],
                    // Add paragraph separator
                    markDecorations: [
                        {
                            _type: 'break', // Custom line break marker
                            _key: randomKey()
                        }
                    ]
                };
            }

            // title
            if (block.type === 'heading') {
                return {
                    _type: 'block',
                    _key: randomKey(),
                    style: `h${block.attrs?.level || 1}`,
                    markDefs: [],
                    children: block.content
                        ? block.content.map((child: any) => ({
                            _type: 'span',
                            _key: randomKey(),
                            text: child.text || '',
                            marks: getMarks(child.marks),
                        }))
                        : [],
                };
            }

            // codeBlock
            if (block.type === 'codeBlock') {
                const codeText = block.content?.map((c: any) => c.text).join('\n') || '';

                return {
                    _type: 'block',
                    _key: randomKey(),
                    style: 'normal',
                    markDefs: [],
                    children: [
                        {
                            _type: 'span',
                            _key: randomKey(),
                            text: codeText,
                            marks: ['code'],
                        },
                    ],
                };
            }

            // list
            if (block.type === 'bulletList' || block.type === 'orderedList') {
                const listItem = block.type === 'bulletList' ? 'bullet' : 'number';
                return block.content.map((item: any) => ({
                    _type: 'block',
                    _key: randomKey(),
                    style: 'normal',
                    listItem,
                    level: 1,
                    markDefs: [],
                    children: item.content
                        ? item.content.flatMap((child: any) =>
                            child.content
                                ? child.content.map((grand: any) => ({
                                    _type: 'span',
                                    _key: randomKey(),
                                    text: grand.text || '',
                                    marks: getMarks(grand.marks),
                                }))
                                : []
                        )
                        : [],
                }));
            }

            return [];
        }).filter((block: any) => block && block.children && block.children.length > 0)
        .map((block: any) => ({
            ...block,
            markDefs: markDefs, // Global markDefs
        }));
    }

    useEffect(() => {
        form.setValue('tag', selectedValues.join(', '));
    }, [selectedValues, form]);

    const handleSelect = (currentValue: string) => {
        setSelectedValues(prev => {
            // Create a new array copy
            const newSelectedValues = [...prev];
            
            // Update selection status
            if (prev.includes(currentValue)) {
                newSelectedValues.splice(prev.indexOf(currentValue), 1);
            } else {
                newSelectedValues.push(currentValue);
            }
            
            return newSelectedValues;
        });
        
        setOpen(false); 
    }

    return (
        <div>
            <NavbarClient isLoggedIn={isAuthenticated} user={user}/>
            <Card className="mt-28 mb-6 container mx-auto py-0 relative">
                <div className="p-7">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="h-22 relative">
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="absolute left-0 bottom-[-2rem]"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem className="h-22 relative">
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="absolute left-0 bottom-[-2rem]"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem className="h-22 relative">
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="website"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        form.trigger("website");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="absolute left-0 bottom-[-2rem]"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tag"
                                    render={({ field }) => (
                                        <FormItem className="h-22 relative">
                                            <FormLabel>Tag</FormLabel>
                                            <FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={open}
                                                            className="w-full justify-between"
                                                        >
                                                            {selectedValues.length > 0
                                                                ? frameworks
                                                                    .filter(fw => selectedValues.includes(fw.value))
                                                                    .map(fw => fw.label)
                                                                    .join(", ")
                                                                : "Select framework..."
                                                            }
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search framework..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {frameworks.map((framework) => (
                                                                        <CommandItem
                                                                            key={framework.value}
                                                                            value={framework.value}
                                                                            onSelect={() => handleSelect(framework.value)}
                                                                        >
                                                                            {framework.label}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    selectedValues.includes(framework.value) ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage className="absolute left-0 bottom-[-2rem]"/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-22">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="self-start">
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <UploadImage onUpload={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem className="self-start">
                                            <FormLabel>icon</FormLabel>
                                            <FormControl>
                                                <UploadImage onUpload={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Tiptap  
                                                        onChange={(value) => {
                                                            const portableText = tiptapToPortableText(value);
                                                            const portableTextStr = JSON.stringify(portableText);
                                                            field.onChange(portableTextStr);
                                                        }} 
                                                        />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="bg-[#f1f5f9] dark:bg-[#171717] dark:border-gray-600/50 border-t p-4 flex justify-between items-center rounded-b-lg absolute left-0 right-0 bottom-0">
                                <Button 
                                    
                                    
                                    className="cursor-pointer rounded-full hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white"
                                >
                                    Submit
                                </Button>
                                <p className="text-[#64748b]">
                                    Don't worry, please check if each item is filled in correctly before submitting
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>

            <Footer />
        </div>
    )
}

export default Submit;