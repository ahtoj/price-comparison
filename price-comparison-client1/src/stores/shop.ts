import type { IShop } from '@/dal/domain/IShop'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useShopStore = defineStore('shops', {
    state: () => ({
        shop: {} as IShop,
        shops: [] as IShop[],
    }),
    getters: {
        shopCount: (state) => state.shops.length,
    },
    actions: {
        add (shop: IShop) {
            this.shops.push(shop)
        }
    },
})
