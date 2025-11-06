import { create } from "zustand";
import { persist } from 'zustand/middleware';

type FormData = {
    title: string;
    slug: string;
    website: string;
    tag: string;
    image: File | null;
    imageBase64?: string; // 用于持久化的base64字符串
    icon: File | null;
    iconBase64?: string; // 用于持久化的base64字符串
    description: string;
};

interface FormDataStore {
    data: FormData;
    setFormData: (data: FormData) => void;
    setImageBase64: (imageBase64: string,iconBase64:string) => void;
    clearFormData?: () => void;
}

const useFormData = create<FormDataStore>()(
    persist(
        (set) => ({
        data: {
            title: '',
            slug: '',
            website: '',
            tag: '',
            image: null,
            imageBase64: undefined,
            icon: null,
            description: ''
        },
        setFormData: (data) => {
            console.log('Setting form data:', data);
            set({ data });
        },
        setImageBase64: (imageBase64,iconBase64) => {
            set((state) => ({
                data: {
                    ...state.data,
                    imageBase64: imageBase64,
                    iconBase64: iconBase64
                }
            }));
        },
        clearFormData: () => set({ data: {} as FormData })
        }),
        {
        name: 'form-data-storage', // Locally stored key names
        partialize: (state) => ({ 
            data: { 
                ...state.data, 
                image: null, // Non persistent file object
                icon: null
            } 
        }),
        }
    )
);

export default useFormData;