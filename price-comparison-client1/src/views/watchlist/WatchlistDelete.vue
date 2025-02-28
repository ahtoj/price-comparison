<template>
    <h4>Delete watchlist {{ id }}</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Delete" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'watchlist' }">Back to Watchlistes</RouterLink>
    </div>
</template>

<script lang="ts">
import { useWatchlistStore } from '@/stores/watchlist'
import { WatchlistService } from '@/bll/service/WatchlistService'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: String
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("WatchlistDelete")
        const id = props.id
        const watchlistStore = useWatchlistStore()
        const watchlistService = new WatchlistService()

        let errorMsg: string | null = null

        return {
            logger,
            id,
            watchlistStore,
            watchlistService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            // const res = await this.watchlistService.delete(this.id);

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.watchlistStore.$state.watchlists =
                    await this.watchlistService.getAll()

                this.$router.push('/watchlist')
            }
             */
        }
    }
})
</script>
