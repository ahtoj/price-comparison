<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Uue hinnangu lisamine</h4>
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
            <div v-if="getReview().id === undefined">
                <div class="form-group">
                    <label class="col-4 control-label">Hinne</label>
                    <Vue3StarRatings
                        v-model="score"
                        starSize="24"
                        starColor="#ff9800"
                        inactiveColor="#333333"
                        :numberOfStars="5"
                        :step="1"
                        :showControl="false"
                        :disableClick="false"
                    />
                </div>
                <div class="form-group">
                    <label class="col-4 control-label">Tekst</label>
                    <textarea v-model="description" class="form-control" rows="3"
                              style="min-width: 100%"></textarea>
                </div>
                <div>
                    <div class="form-group">
                        <input @click="submitClicked()" type="submit" value="Lisa hinnang" class="btn btn-primary"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useReviewStore } from '@/stores/review'
import { ReviewService } from '@/bll/service/ReviewService'
import Logger from '@/util/logger'
import { IdentityService } from '@/bll/service/IdentityService'
import Header from '@/components/Header.vue'
import router from '@/router'
import type { IReview } from '@/dal/domain/IReview'
import { useProductStore } from '@/stores/product'
import { ProductService } from '@/bll/service/ProductService'
import Vue3StarRatings from 'vue3-star-ratings'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        Header,
        Vue3StarRatings,
    },
    props: {
        id: Number,
        required: true,
    },
    emits: [],
    setup(props:any) {
        const logger = new Logger("ReviewCreate")
        const id = props.id

        const reviewStore = useReviewStore()
        const reviewService = new ReviewService()
        const productStore = useProductStore()
        const productService = new ProductService()
        const identityService = new IdentityService()

        const score: number | undefined = undefined
        const description: string | undefined = undefined
        let errorMsg: string | null = null

        onMounted(() => {
            reviewService.get(id).then((item) => {
                if (item.errorMsg !== undefined) {
                    reviewStore.$state.review = {}
                } else {
                    if (item.data) {
                        reviewStore.$state.review = item.data
                    }
                }
            })
            productService.getById(id).then((item) => {
                if (item.errorMsg !== undefined) {
                    errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        productStore.$state.product = item.data
                    }
                }
            })
        })

        return {
            logger,
            reviewStore,
            reviewService,
            productStore,
            productService,
            identityService,
            score,
            description,
            errorMsg,

        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const reviewInfo: IReview = {
                productId: this.id,
                score: this.score,
                description: this.description,
            }
            this.reviewService.add(reviewInfo).then((item : any) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.reviewStore.add(item.data)
                    }
                    router.push('/review')
                }
            })
        },

        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        getProduct ():any {
            return this.productStore.$state.product
        },

        getReview () :any {
            return this.reviewStore.$state.review
        }
    }
})
</script>
