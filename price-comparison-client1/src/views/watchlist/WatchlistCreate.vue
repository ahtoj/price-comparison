<template>
    <h4>Create watchlist</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'watchlistes' }">Back to Watchlists</RouterLink>
    </div>
</template>

<script lang="ts">
import { WatchlistService } from '@/bll/service/WatchlistService'
import { useWatchlistStore } from '@/stores/watchlist'
import { CustomerService } from '@/bll/service/CustomerService'
import type { IWatchlist } from '@/dal/domain/IWatchlist'
import Logger from '@/util/logger'
import router from "@/router";
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("WatchlistCreate")

        const watchlistStore = useWatchlistStore()
        const watchlistService = new WatchlistService()
        const customerService = new CustomerService()

        let errorMsg: string | null = null

        return {
            logger,
            watchlistStore,
            watchlistService,
            customerService,
            errorMsg,
        }

    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const watchlist: IWatchlist = {}
            const res = await this.watchlistService.add(watchlist)

            if (res.status == null || res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                // this.watchlistStore.$state.watchlistes =
                //     await this.watchlistService.getAll()

                await router.push('/watchlist')
            }
        }
    },
})
</script>
