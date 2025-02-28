<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Hinnateavituse lisamine</h4>
    <div class="row">
        <div class="col-md-12">
            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>
            <div class="row">
                <div class="col-4">Toote nimi</div>
                <div class="col-8">{{ getProduct().name }}</div>
            </div>
            <div class="row">
                <div class="col-4">Triipkood</div>
                <div class="col-8">{{ getProduct().barcode }}</div>
            </div>
            <div class="row">
                <div class="col-4">Hetke hind</div>
                <div class="col-8">€{{ getProduct().minPrice }}</div>
            </div>
            <div class="form-group">
                <label class="col-4 control-label">Hinna muutuse samm</label>
                <input type="text" class="col-8" v-model="minStep" style="width: 100px;"/>
            </div>
            <div class="form-group">
                <label class="col-4 control-label">Hinna alumine limiit</label>
                <input type="text" class="col-8" v-model="minValue" style="width: 100px;"/>
            </div>
            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Lisa hinnateavitus" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { AlarmService } from '@/bll/service/AlarmService'
import { useAlarmStore } from '@/stores/alarm'
import Logger from '@/util/logger'
import Header from '@/components/Header.vue'
import { IdentityService } from '@/bll/service/IdentityService'
import router from '@/router'
import type { IAlarm } from '@/dal/domain/IAlarm'
import { ProductService } from '@/bll/service/ProductService'
import { useProductStore } from '@/stores/product'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        Header,
    },
    props: {
        id: Number,
    },
    emits: [],
    setup(props:any) {
        const logger = new Logger("AlarmCreate")

        const alarmStore = useAlarmStore()
        const productStore = useProductStore()
        const alarmService = new AlarmService()
        const productService = new ProductService()
        const identityService = new IdentityService()
        const id = props.id

        const minValue: number | undefined = undefined
        const minStep: number | undefined = undefined
        let errorMsg: string | null = null

        onMounted( () => {
            productService.getById(id).then((item) => {
                if (item.errorMsg !== undefined) {
                    productStore.$state.product = {}
                } else {
                    if (item.data) {
                        productStore.$state.product = item.data
                    }
                }
            })
        })

        return {
            logger,
            alarmStore,
            productStore,
            alarmService,
            productService,
            identityService,
            minValue,
            minStep,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const alarmInfo: IAlarm = {
                productId: this.id,
                minValue: this.minValue,
            }
            this.alarmService.add(alarmInfo).then((item) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.alarmStore.add(item.data)
                    }
                    router.push('/watchlist')
                }
            })
        },

        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        getProduct () {
            return this.productStore.$state.product
        }
    }
})
</script>
