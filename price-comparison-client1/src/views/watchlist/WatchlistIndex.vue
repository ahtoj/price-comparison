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
import { WatchlistService } from '@/bll/service/WatchlistService'
import { useWatchlistStore } from '@/stores/watchlist'
import Logger from '@/util/logger'
import type { IWatchlist } from '@/dal/domain/IWatchlist'
import Header from '@/components/Header.vue'
import { IdentityService } from '@/bll/service/IdentityService'
import router from '@/router'
import type { IAlarm } from '@/dal/domain/IAlarm'
import { useAlarmStore } from '@/stores/alarm'
import { AlarmService } from '@/bll/service/AlarmService'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        Header
    },
    props: {},
    emits: [],
    setup() {

        const logger = new Logger("WatchlistIndex")
        const identityService = new IdentityService()
        const watchlistStore = useWatchlistStore()
        const watchlistService = new WatchlistService()
        const alarmStore = useAlarmStore()
        const alarmService = new AlarmService()

        let errorMsg: string | null = null

        onMounted(async () => {
            logger.info('mounted')
            const items = await watchlistService.getAll()
            watchlistStore.$state.watchlists = items.data as IWatchlist[]
        })

        return {
            logger,
            identityService,
            watchlistStore,
            watchlistService,
            alarmStore,
            alarmService,
            errorMsg,
        }
    },
    methods: {
        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        getWatchlist (): IWatchlist[] {
            return this.watchlistStore.$state.watchlists
        },

        addAlarm (productId: number) {
            this.logger.info('addAlarm')
            router.push('/alarm/create/' + productId)
        },

        clickRemove (watchlistId: number) {
            this.watchlistService.delete(watchlistId).then((item : any) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.watchlistStore.remove(item.data)
                    }
                }
            })
        },

        alarmIsActive (id: number) {
            this.logger.info('alarmIsActive')
            for (let i = 0; i < this.alarmStore.alarmCount; i++) {
                const x = this.alarmStore.$state.alarms[i] as IAlarm
                if (id === x.productId) {
                    return true
                }
            }

            return false
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        }
    }
})

</script>
