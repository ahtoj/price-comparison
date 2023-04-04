import type { IWatchlist } from '@/domain/IWatchlist'
import { defineStore } from 'pinia'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useWatchlistStore = defineStore({
    id: 'watchlists',
    state: () => ({
        watchlist: [] as IWatchlist,
        watchlists: [] as IWatchlist[],
    }),
    getters: {
        watchlistCount: (state) => state.watchlists.length,
    },
    actions: {
        add (watchlist: IWatchlist) {
            this.watchlists.push(watchlist)
        }
    },
})
