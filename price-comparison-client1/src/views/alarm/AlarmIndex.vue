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
import { Options, Vue } from 'vue-class-component'
import { AlarmService } from '@/bll/service/AlarmService'
import { useAlarmStore } from '@/stores/alarm'
import Logger from '@/util/logger'
import { IAlarm } from '@/dal/domain/IAlarm'
import Header from '@/components/Header.vue'
import { IdentityService } from '@/bll/service/IdentityService'
import router from '@/router'

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
export default class AlarmIndex extends Vue {
    private logger = new Logger(AlarmIndex.name)
    private identityService = new IdentityService()
    alarmStore = useAlarmStore()
    alarmService = new AlarmService()

    errorMsg: string | null = null

    async mounted (): Promise<void> {
        this.logger.info('mounted')
        const items = await this.alarmService.getAll()
        this.alarmStore.$state.alarms = items.data as IAlarm[]
    }

    get isAuthenticated (): boolean {
        return this.identityService.isAuthenticated()
    }

    getAlarm (): IAlarm[] {
        return this.alarmStore.$state.alarms
    }

    addAlarm (productId: number) {
        this.logger.info('addAlarm')
        router.push('/alarm/create/' + productId)
    }

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
    }

    getProductImageByBarcode (id: string) {
        return `/images/product/${id}.jpg`
    }
}

</script>
