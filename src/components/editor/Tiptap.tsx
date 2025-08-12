'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';
// import { useState } from 'react';




const Tiptap = ({
    onChange,
}:{
    description?: string;
    onChange: (richText: JSONContent) => void;
}) => {
    // const [content, setContent] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock:{
                    HTMLAttributes:{
                        class: "w-fit max-w-full bg-[#fafafa] border-2 border-[#ededed] rounded-[10px] py-6 px-7 font-mono text-sm text-[#222] my-3 whitespace-pre overflow-x-auto box-border leading-[1.7]"
                    }
                },
                code:{
                    HTMLAttributes:{
                        class: "bg-[#fafafa]"
                    }
                }
            }),
        ],
        content:  "",
        editorProps:{
            attributes:{
                class:"min-h-[210px] border rounded-md p-4 shadow-sm"
            }
        },
        onUpdate({ editor }) {
            onChange(editor.getJSON())
            // setContent(editor.getHTML())
        }
    })

    return (
        <div className="flex flex-col justify-stretch">
            <Toolbar editor={editor}/>
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap
