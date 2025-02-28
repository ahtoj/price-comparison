import type { ICategory } from '@/dal/domain/ICategory'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useCategoryStore = defineStore('categories', {
    state: () => ({
        category: [] as ICategory,
        categories: [] as ICategory[],
    }),
    getters: {
        categoryCount: (state) => state.categories.length,
    },
    actions: {
        setCategories (categories: ICategory[]) {
            this.categories = categories
        },
        add (category: ICategory) {
            this.categories.push(category)
        }
    },
})
