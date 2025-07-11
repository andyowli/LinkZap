"use client"

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Tiptap from "@/components/editor/Tiptap";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UploadImage from "@/components/upload-image";

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


const Submit = () => {
    const [open, setOpen] = React.useState(false)
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        // formData.append('title', title);
        // formData.append('slug', slug);
        // formData.append('website', website);
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('website', data.website);

        if (selectedValues.length > 0) {
            selectedValues.forEach(value => {
                formData.append('category', value);
            });
        } 

        if (data.image instanceof File) {
            formData.append('file', data.image);
        }
        // formData.append('description', description);
        formData.append('description', data.description);
        

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    }

    function randomKey() {
        return Math.random().toString(36).substr(2, 10);
    }

    function tiptapToPortableText(tiptapJson: any) {
        if (!tiptapJson || !tiptapJson.content) return [];
        let markDefs: any[] = [];
        let markKey = 0;

        function getMarks(marks: any[]) {
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
                    // 添加段落分隔符
                    markDecorations: [
                        {
                            _type: 'break', // 自定义换行标记
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
            markDefs: markDefs, // 全局 markDefs
        }));
    }

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
        description: "",
        }
    })

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
            <Navbar />

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
                                    name="description"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Tiptap  
                                                onChange={(value) => {
                                                    const portableText = tiptapToPortableText(value);
                                                    console.log("Converted Portable Text:", portableText); 
                                                    const portableTextStr = JSON.stringify(portableText);
                                                    field.onChange(portableTextStr);
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="bg-[#f1f5f9] p-4 flex justify-between items-center rounded-b-lg absolute left-0 right-0 bottom-0">
                                <Button type="submit" className="cursor-pointer rounded-full hidden md:inline-flex bg-[#409eff] hover:bg-[#409eff]/90 text-white">提交编辑</Button>
                                <p className="text-[#64748b]">
                                    Don't worry, please check if each item is filled in correctly before submitting
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>
    )
}

export default Submit;