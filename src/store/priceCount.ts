import { create } from "zustand";
import { persist } from "zustand/middleware";

type PriceState = {
    price: number;
    setPrice: (price:number) => void;
};

const usePrice = create<PriceState>()(
    persist(
        (set) => ({
            price:0,
            setPrice: (price) => set({ price }),
        }),
        {
            name: 'price-storage', // localStorage key
        }
    )
)

export default usePrice;