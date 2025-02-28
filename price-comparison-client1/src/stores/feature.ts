import type { IFeature } from '@/dal/domain/IFeature'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useFeatureStore = defineStore('features', {
    state: () => ({
        feature: [] as IFeature,
        features: [] as IFeature[],
    }),
    getters: {
        customerCount: (state) => state.features.length,
    },
    actions: {
        add (customer: IFeature) {
            this.features.push(customer)
        }
    },
})
