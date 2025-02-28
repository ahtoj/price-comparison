import type { IWatchlist } from '@/dal/domain/IWatchlist'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useWatchlistStore = defineStore('watchlists', {
    state: () => ({
        watchlist: {} as IWatchlist,
        watchlists: [] as IWatchlist[],
    }),
    getters: {
        watchlistCount: (state) => state.watchlists.length,
    },
    actions: {
        add (watchlist: IWatchlist) {
            this.watchlists.push(watchlist)
        },
        remove (watchlistId: number) {
            this.watchlists = this.watchlists.filter((item) => {
                return item.id !== watchlistId
            })
        },
    },
})
