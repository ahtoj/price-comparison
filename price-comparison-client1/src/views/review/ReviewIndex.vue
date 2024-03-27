<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Hinnangud</h4>
    <div v-for="item of getReviews()" :key="item.id" class="border">
        <div class="row">
            <div class="col-3 p-2 text-right">
                <img :src="getProductImageByBarcode(item.product.barcode)" alt="" height="64"/>
            </div>
            <div class="col-7 p-2">
                <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                    {{ item.product.name }}
                </RouterLink>
                <div class="small">
                    {{ item.product.barcode }}
                    <button class="border-0 small" @click="clickRemove(item.id)">x</button>
                </div>
            </div>
            <div class="col-2 p-2">
                <RouterLink :to="{ name: 'product-details', params: { id: item.productId } }" class="text-dark">
                    <i class="bi bi-star-fill"></i> {{ item.score }}
                </RouterLink>
            </div>
        </div>
        <div class="row" v-if="item.description">
            <div class="col-12 p-4">
                {{ item.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { Options, Vue } from 'vue-class-component'
import { useIdentityStore } from '@/stores/identity'
import { IReview } from '@/dal/domain/IReview'
import router from '@/router'
import { ReviewService } from '@/bll/service/ReviewService'
import { useReviewStore } from '@/stores/review'
import Logger from '@/util/logger'
import { IdentityService } from '@/bll/service/IdentityService'
import Header from '@/components/Header.vue'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {
        Header,
    },
    props: {},
    emits: [],
})
export default class ReviewIndex extends Vue {
    private logger = new Logger(ReviewIndex.name)
    private reviewStore = useReviewStore()
    private reviewService = new ReviewService()
    private merchandiseService = new OfferService()
    private identityStore = useIdentityStore()
    public ratings: IReview[] = []
    private identityService = new IdentityService()

    errorMsg: string | null = null

    get isAdmin (): boolean {
        return this.identityStore.isAdmin()
    }

    async mounted (): Promise<void> {
        this.logger.info('mounted')
        const items = await this.reviewService.getAll()
        this.reviewStore.$state.reviews = items.data as IReview[]
    }

    clickToProduct (merchandiseId: string): void {
        this.logger.info(merchandiseId)
        // this.merchandiseService.get(merchandiseId)
        //     .then(y => {
        //         router.push('/review/details/' + y.productId)
        //     })
    }

    clickToReviewDelete (ratingId: number): void {
        this.reviewService.delete(ratingId)
            .then(() => {
                router.push('/review')
            })
    }

    getReviews(): IReview[] {
        return this.reviewStore.$state.reviews
    }

    get isAuthenticated (): boolean {
        return this.identityService.isAuthenticated()
    }

    clickRemove (reviewId: number) {
        this.reviewService.delete(reviewId).then((item) => {
            if (item.errorMsg !== undefined) {
                this.errorMsg = item.errorMsg
            } else {
                if (item.data) {
                    this.reviewStore.remove(item.data)
                }
            }
        })
    }

    getProductImageByBarcode (id: string) {
        return `/images/product/${id}.jpg`
    }
}

</script>
