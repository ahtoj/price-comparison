<template>
    <Header v-if="isAuthenticated" title=""/>

    <div class="row" v-if="isAuthenticated">
        <div class="col-12">
            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>
            <div v-if="getKeyword().trim().length >= 3">
                <div class="text-right">
                    <button @click="addOffer" class="border-0">
                        <i class="bi bi-database-add"></i> lisa pakkumine
                    </button>
                </div>
                <small>Leitud tooteid: {{ getProductList().length }}</small>
                <div v-for="item of getProductList()" :key="item.id" class="row">
                    <div class="col-3 p-2">
                        <img :src="getProductImageByBarcode(item.barcode)" alt="" height="86"/>
                    </div>
                    <div class="col-5 p-2">
                        <RouterLink :to="{ name: 'product-details', params: { id: item.id } }" class="text-dark">
                            {{ item.name }}
                        </RouterLink>
                        <br/>
                        <small>{{ item.barcode }}</small>
                    </div>
                    <div class="col-2 p-2 text-right">
                        <RouterLink :to="{ name: 'product-details', params: { id: item.id } }" class="text-dark">
                            €{{ item.minPrice }}
                        </RouterLink>
                    </div>
                    <div class="col-2 p-2 text-right">
                        <button @click="addBookmark(item.id)" class="border-0"
                                :style="{backgroundColor: bookmarkIsActive(item.id) ? 'lightgreen' : 'lightgray'}">
                            <i class="bi bi-bookmark-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="getKeyword().trim().length < 3">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <button @click="currentCategoryId=0" class="border-0 small">
                                <i class="bi bi-chevron-compact-right"></i> Kataloog
                            </button>
                        </li>
                        <li class="breadcrumb-item" v-for="breadcrumb of getBreadcrumbs(currentCategoryId)"
                            :key="breadcrumb.id">
                            <button @click="currentCategoryId=breadcrumb.id" class="border-0 small">
                                {{ breadcrumb.name }}
                            </button>
                        </li>
                    </ol>
                </nav>
                <div v-for="item of getFilteredCategoryList(currentCategoryId)" :key="item.id"
                     class="border row">
                    <div class="col-3 p-2">
                        <img :src="getCategoryImageByType(item.categoryTypeCode)" alt="" height="86"/>
                    </div>
                    <div class="col-9 p-2">
                        <button @click="clickCategory(item.id)" class="border-0"
                                style="font-size: 22px;background-color: white;">
                            {{ item.name }}
                        </button>
                    </div>
                </div>
                <div v-if="currentCategoryId > 0 && getProductList().length > 0">
                    <div v-for="item of getProductList()" :key="item.id" class="border row">
                        <div class="col-3 p-2">
                            <img :src="getProductImageByBarcode(item.barcode)" alt="" height="86"/>
                        </div>
                        <div class="col-5 p-2">
                            <div>
                                <RouterLink :to="{ name: 'product-details', params: { id: item.id } }"
                                            class="text-dark">
                                    {{ item.name }}
                                </RouterLink>
                            </div>
                            <small>{{ item.barcode }}</small>
                        </div>
                        <div class="col-2 p-2">
                            <RouterLink :to="{ name: 'product-details', params: { id: item.id } }" class="text-dark">
                                €{{ item.minPrice }}
                            </RouterLink>
                        </div>
                        <div class="col-2 p-2 text-right">
                            <button @click="addBookmark(item.id)" class="border-0"
                                    :style="{backgroundColor: bookmarkIsActive(item.id) ? 'green' : 'lightgray'}">
                                <i class="bi bi-bookmark-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-if="!isAuthenticated">
        <div class="col-12 bg-light custom-home-size">
            <h1 class="custom-home-head">shopleech</h1>
            <div class="row">
                <div class="col-sm-6 col-lg-4">
                    <div class="row">
                        <div class="col-6">
                            Products
                        </div>
                        <div class="col-6 text-right">
                            {{ getStats().numOfProducts }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            Contributions
                        </div>
                        <div class="col-6 text-right">
                            {{ getStats().numOfPriceUpdates }}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            Accounts
                        </div>
                        <div class="col-6 text-right">
                            {{ getStats().numOfUsers }}
                        </div>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-4">
                </div>
            </div>
        </div>
    </div>
    <div class="row" v-if="!isAuthenticated">
        <div class="row fixed-bottom p-3 col-xl-4 col-lg-5 col-md-6 col-sm-7">
            <div class="col-6">
                <RouterLink :to="{ name: 'identity-login'}" class="btn btn-secondary btn-lg w-100">
                    Login
                </RouterLink>
            </div>
            <div class="col-6">
                <RouterLink :to="{ name: 'identity-register'}" class="btn btn-primary btn-lg w-100">
                    Register
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import router from '@/router'
import { ProductService } from '@/bll/service/ProductService'
import { IProduct } from '@/dal/domain/IProduct'
import { StatsService } from '@/bll/service/StatsService'
import { IdentityService } from '@/bll/service/IdentityService'
import Logger from '@/util/logger'
import { useProductStore } from '@/stores/product'
import { useStatsStore } from '@/stores/stats'
import { IPublicStats } from '@/dal/domain/IPublicStats'
import { useCategoryStore } from '@/stores/category'
import { CategoryService } from '@/bll/service/CategoryService'
import { ICategory } from '@/dal/domain/ICategory'
import { IBreadcrumb } from '@/dal/domain/IBreadcrumb'
import { useIdentityStore } from '@/stores/identity'
import Header from '@/components/Header.vue'
import { IWatchlist } from '@/dal/domain/IWatchlist'
import { WatchlistService } from '@/bll/service/WatchlistService'
import { useWatchlistStore } from '@/stores/watchlist'
import { useOfferStore } from '@/stores/offer'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
    components: {
        Header,
    },
    data () {
        return {}
    },
    methods: {},
    props: {},
})
export default class HomeView extends Vue {
    private logger = new Logger(HomeView.name)
    private identityService = new IdentityService()
    private productService = new ProductService()
    private statsService = new StatsService()
    private categoryService = new CategoryService()
    private identityStore = useIdentityStore()
    private productStore = useProductStore()
    private statsStore = useStatsStore()
    private categoryStore = useCategoryStore()
    private watchlistStore = useWatchlistStore()
    private offerStore = useOfferStore()
    private watchlistService = new WatchlistService()

    currentCategoryId = 0
    keyword: string | null = ''
    errorMsg: string | null = null

    get isAuthenticated (): boolean {
        return this.identityService.isAuthenticated()
    }

    async logoutClicked (): Promise<void> {
        this.logger.info('trying to logout')
        await this.identityService.logout()
        await router.push('/')
    }

    mounted (): void {
        this.logger.info('mounted')

        this.statsService.getPublicStats().then((item) => {
            this.logger.info('found something')
            if (item.errorMsg !== undefined) {
                this.errorMsg = item.errorMsg
            } else {
                if (item.data) {
                    this.statsStore.$state.publicStats = item.data
                }
            }
        })

        this.categoryService.getAll().then((items) => {
            if (items.errorMsg !== undefined) {
                this.errorMsg = items.errorMsg
            } else {
                if (items.data) {
                    this.categoryStore.$state.categories = items.data
                }
            }
        })

        /*
        if (this.keyword != null && this.keyword.length > 0) {
            if (this.keyword.trim().length < 3) {
                this.productStore.$reset()
                return
            }

            this.productService.findByName(this.keyword).then((items) => {
                this.logger.info('found something')
                if (items.errorMsg !== undefined) {
                    this.errorMsg = items.errorMsg
                } else {
                    if (items.data) {
                        this.productStore.$state.products = items.data
                    }
                }
            })
        } */
    }

    getProductList (): IProduct[] {
        return this.productStore.$state.products
    }

    getStats (): IPublicStats {
        return this.statsStore.$state.publicStats
    }

    getCategoryList (): ICategory[] {
        return this.categoryStore.$state.categories
    }

    getFilteredCategoryList (parentId: number) {
        return this.getCategoryList()
            .filter(element => typeof element !== 'undefined' && element.parentCategoryId === parentId)
    }

    getBreadcrumbs (categoryId: number): ICategory[] {
        const breadcrumbs = [] as IBreadcrumb[]
        if (!categoryId) {
            return breadcrumbs
        }

        let item = this.getCategoryList()
            .filter(element => typeof element !== 'undefined' && element.id === categoryId).shift()
        if (item) {
            breadcrumbs.push(item)
        }

        let parentId = item?.parentCategoryId ?? 0
        while (parentId > 0) {
            item = this.getCategoryList()
                .filter(element => typeof element !== 'undefined' && element.id === parentId).shift()
            if (item) {
                breadcrumbs.push(item)
            }

            parentId = item?.parentCategoryId ?? 0
        }

        return breadcrumbs.reverse()
    }

    clickCategory (categoryId: number) {
        this.currentCategoryId = categoryId

        //
        this.watchlistService.getAll().then((items) => {
            if (items.errorMsg !== undefined) {
                this.errorMsg = items.errorMsg
            } else {
                if (items.data) {
                    this.watchlistStore.$state.watchlists = items.data
                }
            }
        })

        // get products by category id
        this.productService.findByCategoryId(categoryId).then((items) => {
            this.logger.info('found something')
            if (items.errorMsg !== undefined) {
                this.errorMsg = items.errorMsg
            } else {
                if (items.data) {
                    this.productStore.$state.products = items.data
                }
            }
        })
        // end
    }

    getKeyword () {
        const keyword = this.productStore.$state.keyword
        return keyword.trim()
    }

    isNumeric (value: string) {
        return /^-?\d+$/.test(value)
    }

    addOffer () {
        this.logger.info('addOffer')
        this.offerStore.$state.offer = {
            name: !this.isNumeric(this.getKeyword()) ? this.getKeyword() : '',
            barcode: this.isNumeric(this.getKeyword()) ? this.getKeyword() : '',
        }
        router.push({
            name: 'offer-create',
        })
    }

    addBookmark (id: number) {
        this.logger.info('addBookmark')
        if (this.bookmarkIsActive(id)) {
            this.watchlistService.delete(this.getWatchlistIdFromProductId(id)).then((item) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.logger.info(item.data.toString())
                        this.watchlistStore.remove(item.data)
                        this.clickCategory(this.currentCategoryId)
                    }
                }
            })
        } else {
            const entity = {
                productId: id,
            } as IWatchlist
            this.watchlistService.add(entity).then((item) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.watchlistStore.add(item.data)
                    }
                }
            })
        }
    }

    bookmarkIsActive (id: number) {
        this.logger.info('bookmarkIsActive')
        for (let i = 0; i < this.watchlistStore.watchlistCount; i++) {
            const x = this.watchlistStore.$state.watchlists[i] as IWatchlist
            if (id === x.productId) {
                return true
            }
        }

        return false
    }

    getWatchlistIdFromProductId (id: number): number {
        this.logger.info('bookmarkIsActive')
        for (let i = 0; i < this.watchlistStore.watchlistCount; i++) {
            const x = this.watchlistStore.$state.watchlists[i] as IWatchlist
            if (id === x.productId) {
                return x.id ?? 0
            }
        }

        return 0
    }

    getCategoryImageByType (id: string) {
        return `/images/category/${id}.png`
    }

    getShopImageByType (id: string) {
        return `/images/shop/${id}`
    }

    getProductImageByBarcode (id: string) {
        return `/images/product/${id}.jpg`
    }

    getWatchlistId (): number {
        if (this.getWatchlist().id) {
            return this.getWatchlist().id ?? 0
        }
        return 0
    }

    getWatchlist (): IWatchlist {
        return this.watchlistStore.$state.watchlist
    }
}
</script>

<style scoped>
.custom-home-head {
    padding: 40px 0 30px 0;
}

.custom-home-size {
    font-size: 170%;
}
</style>
