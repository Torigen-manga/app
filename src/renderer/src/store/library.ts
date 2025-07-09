import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type CategoryOrderState = {
	categoryOrder: Record<string, number>;
	setCategoryOrder: (order: Record<string, number>) => void;
};

export const categoryOrderStore = create<CategoryOrderState>()(
	persist(
		(set) => ({
			categoryOrder: {},
			setCategoryOrder: (order) => set({ categoryOrder: order }),
		}),
		{
			name: "category-order-storage",
		}
	)
);

const useCategoryOrder = () => useStore(categoryOrderStore);

export { useCategoryOrder };
