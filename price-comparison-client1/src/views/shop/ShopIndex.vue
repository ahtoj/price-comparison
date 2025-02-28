<template>
    <div class="row">
        <div class="col-lg-3 border p-2">
            <p>What now?</p>
        </div>
        <div class="col-lg-9">
            <h3>Your product reviews</h3>
            <div v-if="isAuthenticated">
                <div v-for="item of ratings" :key="item.id" class="row p-2">
                    <div class="col-3">
                        <a href="#" @click="clickToProduct(item.productId)">
                            <img :src="getProductImageByBarcode(item.product.barcode)" alt="product"/>
                        </a>
                    </div>
                    <div class="col-6">
                        <h3>{{ item.productName }}</h3>
                        <p>
                            {{ item.description }}
                        </p>
                        <p>Score: {{ item.score }}</p>
                    </div>
                    <div class="col-3">
                        <a href="#" @click="clickToShopDelete(item.id)">
                            Delete
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { useIdentityStore } from '@/stores/identity'
import type { IReview } from '@/dal/domain/IReview'
import { useShopStore } from '@/stores/shop'
import { ShopService } from '@/bll/service/ShopService'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 31.03.2023
 */
export default defineComponent({
    setup() {
        const logger = new Logger("ShopIndex")
        const shopStore = useShopStore()
        const shopService = new ShopService()
        const offerService = new OfferService()
        const identityStore = useIdentityStore()
        const ratings: IReview[] = []

        onMounted(() => {
            logger.info('mounted')
            // const items = await this.shopService.getAll()
            // this.ratings = items.data as IReview[]
        })

        return {
            logger,
            shopService,
            shopStore,
            offerService,
            identityStore,
            ratings,
        }
    },
    methods: {
        isAuthenticated (): boolean {
            return this.identityStore.getJwt() !== null
        },

        isAdmin (): boolean {
            return this.identityStore.isAdmin()
        },

        clickToProduct (merchandiseId: string): void {
            this.logger.info(merchandiseId)
            // this.offerService.get(merchandiseId)
            //     .then(y => {
            //         router.push('/products/details/' + y.productId)
            //     })
        },

        clickToShopDelete (ratingId: string): void {
            this.logger.info(ratingId)
            // this.shopService.delete(ratingId)
            //     .then(() => {
            //         this.logger.log('success')
            //         router.push('/ratings')
            //     })
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        }
    }
})

</script>
