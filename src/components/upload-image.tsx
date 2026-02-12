"use client"

import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useRef, useState } from "react";
export default function UploadImage({ onUpload }: { onUpload?: (file: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
    
    const { getRootProps,getInputProps,isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/webp": [".webp"]
        },
        onDrop: async(acceptFiles) => {
            console.log("Dropped files:", acceptFiles); 
            if (acceptFiles && acceptFiles.length > 0) {
                const file = acceptFiles[0];

                const maxSize = 1 * 1024 * 1024; // 1MB Convert to bytes
                if (file.size > maxSize) {
                    alert("文件大小超过 1MB,请上传更小的文件。");
                    return;
                }
                
                if(onUpload) onUpload(file);

                const objectUrl = URL.createObjectURL(file);
                setUploadedImages([{ name: file.name, url: objectUrl }]);
            }
        }
    })

    return (
        <div>
            <Card 
                {...getRootProps({
                    onClick: (e) => {
                        // Enable input to be clicked and support click upload
                        e.stopPropagation();
                        const input = inputRef.current;
                        input?.click();
                    }
                })}
                className={cn("hover:cursor-pointer hover:bg-secondary hover:border-blue-500 transition-all ease-in-out h-[20rem]", 
                `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`)}
            >
                <CardContent className="flex flex-col justify-center px-2 text-xs h-full">
                    <Input {...getInputProps()} type="file" ref={inputRef}/>
                    {/* Display uploaded images */}
                    {uploadedImages.length > 0 ? (
                        <div className="w-full">
                            <img
                                src={uploadedImages[0].url}
                                alt="Preview"
                                className="w-full h-72 object-cover rounded-md"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-muted-foreground text-lg">
                                {isDragActive ? "Drop the image here..." : "Start by uploading an image"}
                            </p>
                            <p className="text-muted-foreground">Supported formats .jpeg .png .webp</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}