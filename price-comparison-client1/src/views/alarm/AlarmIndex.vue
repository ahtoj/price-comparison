<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Hinnateavitused</h4>
    <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
        <ul>
            <li>{{ errorMsg }}</li>
        </ul>
    </div>
    <div v-for="item of getAlarm()" :key="item.id" class="border p-2 mb-4 row">
        <div class="col-2">
            <img :src="getProductImageByBarcode(item.product.barcode)" alt="product"/>
            <button class="small" @click="clickRemove(item.id)">x</button>
        </div>
        <div class="col-6">
            <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                {{ item.product.name }}
            </RouterLink>
            <div class="small">{{ item.product.barcode }}</div>
        </div>
        <div class="col-2">
            <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                €{{ item.product.minPrice }}
            </RouterLink>
        </div>
        <div class="col-2">
            €{{ item.minValue }}
        </div>
    </div>
</template>

<script lang="ts">
import { AlarmService } from '@/bll/service/AlarmService'
import { useAlarmStore } from '@/stores/alarm'
import Logger from '@/util/logger'
import type { IAlarm } from '@/dal/domain/IAlarm'
import Header from '@/components/Header.vue'
import { IdentityService } from '@/bll/service/IdentityService'
import router from '@/router'
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
        const logger = new Logger("AlarmIndex")
        const identityService = new IdentityService()
        const alarmStore = useAlarmStore()
        const alarmService = new AlarmService()

        let errorMsg: string | null = null

        onMounted(async () => {
            logger.info('mounted')
            const items = await alarmService.getAll()
            alarmStore.$state.alarms = items.data as IAlarm[]
        })

        return {
            logger,
            identityService,
            alarmStore,
            alarmService,
            errorMsg,
        }
    },
    methods: {
        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        getAlarm (): IAlarm[] {
            return this.alarmStore.$state.alarms
        },

        addAlarm (productId: number) {
            this.logger.info('addAlarm')
            router.push('/alarm/create/' + productId)
        },

        clickRemove (alarmId: number) {
            this.alarmService.delete(alarmId).then((item) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.alarmStore.remove(item.data)
                    }
                }
            })
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        },
    }
})
</script>
