"use client"

import { type Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import { Bold, Code, Heading, Heading1, Heading2, Heading3, Italic, List, ListOrdered } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
} from '@/components/tiptap-ui-primitive/dropdown-menu';
import { Button } from '@/components/tiptap-ui-primitive/button';


type Props = {
    editor : Editor | null;
}

export function Toolbar({ editor } : Props) {
    if(!editor) {
        return null;
    }

    return (
        <div className="flex border border-input bg-transparent rounded-md mb-2">
            <DropdownMenu>    
                <DropdownMenuTrigger asChild>
                    <Button
                        data-style="ghost" 
                        type="button"
                    >
                        <Heading className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Button 
                                data-style="ghost" 
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            >
                                <Heading1 className="w-5 h-5" />
                                Heading 1
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button 
                                data-style="ghost" 
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            >
                                <Heading2 className="w-5 h-5" />
                                Heading 2
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button 
                                data-style="ghost" 
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            >
                                <Heading3 className="w-5 h-5" />
                                Heading 3
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => 
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold className="w-5 h-5" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => 
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className="w-5 h-5" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => 
                    editor.chain().focus().toggleCode().run()
                }
            >
                <Code className="w-5 h-5" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => 
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className="w-5 h-5" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => 
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className="w-5 h-5" />
            </Toggle>
        </div>
    )
}