<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Jälgimisnimekiri</h4>
    <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
        <ul>
            <li>{{ errorMsg }}</li>
        </ul>
    </div>
    <div v-for="item of getWatchlist()" :key="item.id" class="border row">
        <div class="col-2 p-2">
            <img :src="getProductImageByBarcode(item.product.barcode)" alt="" height="64"/>
        </div>
        <div class="col-6 p-2">
            <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                {{ item.product.name }}
            </RouterLink>
            <div class="small">
                {{ item.product.barcode }}
                <button class="border-0 small" @click="clickRemove(item.id)">x</button>
            </div>
        </div>
        <div class="col-2 p-2">
            <div>
                <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                    €{{ item.product.minPrice }}
                </RouterLink>
            </div>
        </div>
        <div class="col-2 p-2 text-right">
            <button @click="addAlarm(item.productId)" class="border-0"
                    :style="{backgroundColor: alarmIsActive(item.productId) ? 'green' : 'lightgray'}">
                <i class="bi bi-bell"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { WatchlistService } from '@/bll/service/WatchlistService'
import { useWatchlistStore } from '@/stores/watchlist'
import Logger from '@/util/logger'
import { IWatchlist } from '@/dal/domain/IWatchlist'
import Header from '@/components/Header.vue'
import { IdentityService } from '@/bll/service/IdentityService'
import router from '@/router'
import { IAlarm } from '@/dal/domain/IAlarm'
import { useAlarmStore } from '@/stores/alarm'
import { AlarmService } from '@/bll/service/AlarmService'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {
        Header
    },
    props: {},
    emits: [],
})
export default class WatchlistIndex extends Vue {
    private logger = new Logger(WatchlistIndex.name)
    private identityService = new IdentityService()
    watchlistStore = useWatchlistStore()
    watchlistService = new WatchlistService()
    alarmStore = useAlarmStore()
    alarmService = new AlarmService()

    errorMsg: string | null = null

    async mounted (): Promise<void> {
        this.logger.info('mounted')
        const items = await this.watchlistService.getAll()
        this.watchlistStore.$state.watchlists = items.data as IWatchlist[]
    }

    get isAuthenticated (): boolean {
        return this.identityService.isAuthenticated()
    }

    getWatchlist (): IWatchlist[] {
        return this.watchlistStore.$state.watchlists
    }

    addAlarm (productId: number) {
        this.logger.info('addAlarm')
        router.push('/alarm/create/' + productId)
    }

    clickRemove (watchlistId: number) {
        this.watchlistService.delete(watchlistId).then((item) => {
            if (item.errorMsg !== undefined) {
                this.errorMsg = item.errorMsg
            } else {
                if (item.data) {
                    this.watchlistStore.remove(item.data)
                }
            }
        })
    }

    alarmIsActive (id: number) {
        this.logger.info('alarmIsActive')
        for (let i = 0; i < this.alarmStore.alarmCount; i++) {
            const x = this.alarmStore.$state.alarms[i] as IAlarm
            if (id === x.productId) {
                return true
            }
        }

        return false
    }

    getProductImageByBarcode (id: string) {
        return `/images/product/${id}.jpg`
    }
}

</script>
