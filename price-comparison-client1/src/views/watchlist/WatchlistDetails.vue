<template>
    <h2>Details watchlist {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'watchlistes-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'watchlistes-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'watchlistes-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'watchlistes' }">Back to Watchlistes</RouterLink>
    </div>
</template>

<script lang="ts">
import { WatchlistService } from '@/bll/service/WatchlistService'
import { useWatchlistStore } from '@/stores/watchlist'
import Logger from '@/util/logger'
import type { IWatchlist } from '@/dal/domain/IWatchlist'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: Number,
    },
    emits: [],
    setup (props) {
        const logger = new Logger("WatchlistDetails")

        const id = props.id
        const watchlistStore = useWatchlistStore()
        const watchlistService = new WatchlistService()

        onMounted(async () => {
            logger.info('mounted')
            if (id) {
                const item = await watchlistService.get(id)
                watchlistStore.$state.watchlist = item.data as IWatchlist
            }
        })

        return {
            id,
            watchlistStore,
            watchlistService,
            logger,
        }
    }
})

</script>
