import { defineStore } from 'pinia'
import type { IReview } from '@/dal/domain/IReview'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useReviewStore = defineStore('reviews', {
    state: () => ({
        review: {} as IReview,
        reviews: [] as IReview[],
    }),
    getters: {
        reviewCount: (state) => state.reviews.length,
    },
    actions: {
        add (review: IReview) {
            this.reviews.push(review)
        },
        remove (reviewId: number) {
            this.reviews = this.reviews.filter((item) => {
                return item.id !== reviewId
            })
        },
    },
})
