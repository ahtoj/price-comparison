import type { IProduct } from '@/dal/domain/IProduct'
import { defineStore } from 'pinia'
import type { IOffer } from '@/dal/domain/IOffer'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useProductStore = defineStore('products', {
    state: () => ({
        product: {} as IProduct,
        products: [] as IProduct[],
        offers: [] as IOffer[],
        rating_text: 'No Rating Selected',
        currentRating: 'No Rating',
        currentSelectedRating: 'No Current Rating',
        boundRating: 3,
        keyword: '',
    }),
    getters: {
        productCount: (state) => state.products.length,
        products: (state) => state.products,
    },
    actions: {
        add (product: IProduct) {
            this.products.push(product)
        },
        setRating: function (rating: string) {
            this.rating_text = 'You have Selected: ' + rating + ' stars'
        },
        showCurrentRating: function (rating: any) {
            this.currentRating = (rating === 0) ? this.currentSelectedRating : 'Click to select ' + rating + ' stars'
        },
        setCurrentSelectedRating: function (rating: any) {
            this.currentSelectedRating = 'You have Selected: ' + rating + ' stars'
        },
        getCount: function () {
            return this.products.length
        }
    },
})
