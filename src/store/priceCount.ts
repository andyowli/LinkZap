import { create } from "zustand";
import { persist } from "zustand/middleware";

type PriceState = {
    price: number;
    setPrice: (price:number) => void;
    clearPrice: () => void;
};

const usePrice = create<PriceState>()(
    persist(
        (set) => ({
            price:0,
            setPrice: (price) => set({ price }),
            clearPrice: () => set({ price:0 }),
        }),
        {
            name: 'price-storage', // localStorage key
        }
    )
)

export default usePrice;