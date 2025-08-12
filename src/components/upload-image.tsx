"use client"

import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useState } from "react";
import { Progress } from "./ui/progress";
export default function UploadImage({ onUpload }: { onUpload?: (file: File) => void }) {
    const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    
    const { getRootProps,getInputProps,isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/webp": [".webp"]
        },
        onDrop: async(acceptFiles) => {
            if (acceptFiles && acceptFiles.length > 0) {
                setUploading(true);
                setProgress(0);

                const file = acceptFiles[0];
                if(onUpload) onUpload(file);

                const simulateProgress = () => {
                    setProgress((prev) => {
                        if (prev >= 100) {
                            setUploading(false);
                            const file = acceptFiles[0];
                            const objectUrl = URL.createObjectURL(file);
                            setUploadedImages([{ name: file.name, url: objectUrl }]);
                            return 100;
                        }
                        setTimeout(simulateProgress, 300);
                        return prev + 5;
                    });
                };
                simulateProgress();
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
                        const input = document.querySelector<HTMLInputElement>('input[type="file"]');
                        input?.click();
                    }
                })}
                className={cn("hover:cursor-pointer hover:bg-secondary hover:border-blue-500 transition-all ease-in-out", 
                `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`)}
            >
                <CardContent className="flex flex-col items-center justify-center px-2 py-9 text-xs">
                    <Input {...getInputProps()} type="file"/>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <p className="text-muted-foreground text-lg">
                            {isDragActive 
                                ? "Drop the image here..." 
                                : "Start by uploading an image"
                            }
                        </p>
                        <p className="text-muted-foreground">
                            Supported formats .jpeg .png .webp
                        </p>
                    </div>
                </CardContent>
            </Card>

            {uploadedImages.length > 0 && (
                <div className="flex flex-col gap-2 mt-4"> 
                    <span className="text-sm text-muted-foreground">Upload List</span>
                    <ul>
                        {uploadedImages.map((img) => (
                            <li key={img.name} className="flex items-center gap-2">
                                <img src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded" />
                                <span className="truncate max-w-xs">{img.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {uploading && (
                <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">上传中...</span>
                    <Progress value={progress} className="w-full transition-all duration-[3000]" />
                </div>
            )}
        </div>
    )
}