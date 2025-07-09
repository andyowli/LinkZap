"use client"

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import React, { useState } from "react";
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

    const [title,setTitle] = useState('');
    const [slug,setSlug] = useState('');
    const [website,setWebsite] = useState('');
    const [file,setFile] = useState<File | null>(null);

    console.log("File:", file);
    const [description,setDescription] = useState('');
    console.log("Data:", description);

    const handleSubmit = async (data: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('website', website);

        if (selectedValues.length > 0) {
            selectedValues.forEach(value => {
                formData.append('category', value);
            });
        } 

        if (file) {
            formData.append('file', file);
        }
        formData.append('description', description);
        

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
                    // 生成唯一 key
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


    const handleSelect = (currentValue: string) => {
        // Determine whether the frameworks array contains the clicked current value
        if (selectedValues.includes(currentValue)) {
            // Delete clicking on frame value and other values 
            setSelectedValues(selectedValues.filter(v => v !== currentValue))
        } else {
            setSelectedValues([...selectedValues, currentValue])
        }
    }

    const formSchema = z.object({
        title: z
        .string({ message: "Title cannot be empty" })
        .nonempty({ message: "Title cannot be empty" })
        .min(5, { message:"Title is not long enough" })
        .max(50, { message: "Title is too long" }),

        slug: z
        .string()
        .min(5, { message: "Slug is not long enough" })
        .max(50, { message: "Slug is too long" }),

        website: z
        .string()
        .min(5, { message: "Website is not long enough" })
        .max(50, { message: "Website is too long" }),

        tag: z
        .string()
        .min(5, { message: "Tag is not long enough" })
        .max(50, { message: "Tag is too long" }),

        image: z
        .instanceof(File),

        description: z
        .string()
        .min(5, { message: "Description is not long enough" })
        .max(5000, { message: "Description is too long" }),
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


    return (
        <div>
            <Navbar />

            <Card className="mt-28 container mx-auto py-0 relative">
                <div className="p-7">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter title"
                                                {...field}
                                                // onChange={(e) => {
                                                //     field.onChange(e);
                                                //     setTitle(e.target.value)
                                                // }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="slug"
                                                {...field}
                                                // onChange={(e) => {
                                                //     field.onChange(e);
                                                //     setSlug(e.target.value)
                                                // }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="website"
                                                {...field}
                                                // onChange={(e) => {
                                                //     field.onChange(e);
                                                //     setWebsite(e.target.value)
                                                // }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tag"
                                    render={({ field }) => (
                                    <FormItem>
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
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                    <FormItem className="self-start">
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <UploadImage onUpload={setFile} />
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
                                            <Tiptap  onChange={(value) => {
                                                const portableText = tiptapToPortableText(value);
                                                const portableTextStr = JSON.stringify(portableText);
                                                field.onChange(portableTextStr); // 这里传字符串
                                                setDescription(portableTextStr);
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