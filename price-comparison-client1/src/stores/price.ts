import type { IPrice } from '@/dal/domain/IPrice'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const usePriceStore = defineStore('prices', {
    state: () => ({
        price: {} as IPrice,
        prices: [] as IPrice[],
        rating_text: 'No Rating Selected',
        currentRating: 'No Rating',
        currentSelectedRating: 'No Current Rating',
        boundRating: 3,
    }),
    getters: {
        priceCount: (state) => state.prices.length,
    },
    actions: {
        add (price: IPrice) {
            this.prices.push(price)
        },
        setRating: function (rating: string) {
            this.rating_text = 'You have Selected: ' + rating + ' stars'
        },
        showCurrentRating: function (rating: any) {
            this.currentRating = (rating === 0) ? this.currentSelectedRating : 'Click to select ' + rating + ' stars'
        },
        setCurrentSelectedRating: function (rating: any) {
            this.currentSelectedRating = 'You have Selected: ' + rating + ' stars'
        }
    },
})
