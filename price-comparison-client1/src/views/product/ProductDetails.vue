<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <div class="row">
        <div class="col-4">
            <button @click="clickAddReview(getProduct().id)" class="small border-0 h-100"
                    :style="{backgroundColor: reviewIsActive(getProduct().id) ? 'lightgreen' : 'lightgray'}">
                <i class="bi bi-star"></i> uus hinnang
            </button>
        </div>
        <div class="col-4">
            <button @click="addBookmark(getProduct().id)" class="small border-0 h-100"
                    :style="{backgroundColor: bookmarkIsActive(getProduct().id) ? 'lightgreen' : 'lightgray'}">
                <i class="bi bi-bookmark-plus"></i> lisa nimekirja
            </button>
        </div>
        <div class="col-4">
            <button @click="clickAddOffer(getProduct().id)" class="small border-0 h-100"
                    style="background-color: lightgray;">
                <i class="bi bi-database-add"></i> uus pakkumine
            </button>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-12 text-center">
            <img :src="getProductImageByBarcode(getProduct().barcode)" alt="" height="164"/>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3 p-2">Nimi</div>
        <div class="col-9 p-2">{{ getProduct().name }}</div>
    </div>
    <div class="row p-2">
        <div class="col-3 p-2">Triipkood</div>
        <div class="col-9 p-2">{{ getProduct().barcode }}</div>
    </div>

    <h4>Pakkumised</h4>
    <div v-for="item of getOffersDetails()" :key="item.id" class="border" @click="setItemDetails(item.id)">
        <div class="row border-1">
            <div class="col-3 p-2 text-center">
                <img :src="getShopImageByType(item.url)" alt="" width="32" height="32" v-if="item.url"/>
            </div>
            <div class="col-7 p-2">
                <div>{{ item.name }}</div>
                <div v-if="this.identityStore.getCoords().latitude">{{
                        distanceUtil.round(
                            distanceUtil.calculateDistance(
                                this.identityStore.getCoords().latitude,
                                this.identityStore.getCoords().longitude,
                                item.latitude, item.longitude))
                    }}km
                </div>
            </div>
            <div class="col-2 p-2">
                €{{ item.offers.sort((a, b) => a.price.amount - b.price.amount)[0].price.amount }}
            </div>
        </div>
        <div v-if="showItemDetails(item.id)" style="background-color: lightgrey;">
            <div class="row border-bottom-1" v-for="subItem of item.offers" :key="subItem.id">
                <div class="col-8">
                    <div>Toote nimi: {{ subItem.name }}</div>
                    <div>Lisatud: {{ subItem.addedBy }}</div>
                </div>
                <div class="col-4" v-if="subItem.price.amount">
                    €{{ subItem.price.amount }}
                </div>
            </div>
        </div>
    </div>

    <div style="width: 100%; height: 250px;">
        <l-map
            v-model="zoom"
            v-model:zoom="zoom"
            :center="[59.436962, 24.753574]"
            @move="log('move')"
        >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></l-tile-layer>

            <l-marker :lat-lng="[item.latitude, item.longitude]" v-for="item of getOffersDetails()" :key="item.id">
                <l-tooltip>
                    €{{ item.name }}
                </l-tooltip>
            </l-marker>
        </l-map>
    </div>

    <h4>Toote detailid</h4>
    <div class="border-1">
        <h6>Kirjeldus</h6>
        <div class="p-2" style="background-color: lightgrey;">{{ getProduct().description }}</div>
<!--        <h6>Sektsioon</h6>-->
<!--        <div class="row" style="background-color: lightgrey;">-->
<!--            <div class="col-4">värv</div>-->
<!--            <div class="col-8">valge</div>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--            <div class="col-4">materjal</div>-->
<!--            <div class="col-8">puit</div>-->
<!--        </div>-->
    </div>
</template>

<script lang="ts">
import { ProductService } from '@/bll/service/ProductService'
import Logger from '@/util/logger'
import type { IShop } from '@/dal/domain/IShop'
import { useShopStore } from '@/stores/shop'
import { ShopService } from '@/bll/service/ShopService'
import { useIdentityStore } from '@/stores/identity'
import { useProductStore } from '@/stores/product'
import DistanceUtil from '@/util/distance-util'
import { IdentityService } from '@/bll/service/IdentityService'
import Header from '@/components/Header.vue'
import { WatchlistService } from '@/bll/service/WatchlistService'
import router from '@/router'
import type { IWatchlist } from '@/dal/domain/IWatchlist'
import type { IOfferResults } from '@/dal/domain/IOfferResults'
import type { IOffer } from '@/dal/domain/IOffer'
import { useWatchlistStore } from '@/stores/watchlist'
import type { IReview } from '@/dal/domain/IReview'
import { useReviewStore } from '@/stores/review'
import {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
} from '@vue-leaflet/vue-leaflet'
import type { IProduct } from '@/dal/domain/IProduct'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 15.04.2023
 */
export default defineComponent({
    setup(props : any) {
        const id = props.id
        const logger = new Logger("ProductDetails")
        const productService = new ProductService()
        const offerService = new ProductService()
        const shopService = new ShopService()
        const watchlistService = new WatchlistService()
        const shopStore = useShopStore()
        const identityStore = useIdentityStore()
        const productStore = useProductStore()
        const watchlistStore = useWatchlistStore()
        const reviewStore = useReviewStore()
        const identityService = new IdentityService()
        const distanceUtil = new DistanceUtil()

        const productId = 0
        let errorMsg: string | null = null
        const itemDetails: any = []

        onMounted(() => {
            logger.info('mounted')
            const distanceUtil = new DistanceUtil()

            productService.getById(id).then((item) => {
                if (item.errorMsg !== undefined) {
                    errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        productStore.$state.product = item.data
                    }
                }
            })

            productService.getOfferListById(id).then((items) => {
                if (items.errorMsg !== undefined) {
                    errorMsg = items.errorMsg
                } else {
                    if (items.data) {
                        productStore.$state.offers = items.data
                    }
                }
            })

            shopService.getAll().then((items : any) => {
                if (items.errorMsg !== undefined) {
                    errorMsg = items.errorMsg
                } else {
                    const uniqueNodes = items.data
                    if (uniqueNodes) {
                        for (let i = 0; i < uniqueNodes.length; i++) {
                            uniqueNodes[i].distance = distanceUtil.calculateDistance(
                                identityStore.getCoords().latitude ?? 59.436962,
                                identityStore.getCoords().longitude ?? 24.753574,
                                uniqueNodes[i].latitude ?? 59.436962,
                                uniqueNodes[i].longitude ?? 24.753574,
                                'K'
                            )
                        }

                        uniqueNodes.sort(function (a : any, b : any) {
                            return (a.distance ?? 0) - (b.distance ?? 0)
                        })

                        shopStore.$state.shops = uniqueNodes
                    }
                }
            })
        })

        return {
            id,
            logger,
            productService,
            offerService,
            shopService,
            watchlistService,
            shopStore,
            identityStore,
            productStore,
            watchlistStore,
            reviewStore,
            identityService,
            distanceUtil,
            productId,
            errorMsg,
            itemDetails,
        }
    },
    components: {
        Header,
        LMap,
        LIcon,
        LTileLayer,
        LMarker,
        LControlLayers,
        LTooltip,
        LPopup,
        LPolyline,
        LPolygon,
        LRectangle,
    },
    props: {
        id: Number,
    },
    emits: [],
    data() {
        return {
            zoom: 10,
            iconWidth: 25,
            iconHeight: 40,
        };
    },
    computed: {
        iconUrl() : any {
            return `https://placekitten.com/25/25`;
        },
        iconSize() : any {
            return [25, 25];
        },
    },
    methods: {
        log(a: string) {
            console.log(a);
        },

        submitClicked (): void {
            this.logger.info('submitClicked')
        },

        getShopList (): IShop[] {
            return this.shopStore.$state.shops
        },

        getProduct (): IProduct {
            return this.productStore.$state.product
        },

        getOffers (): IOffer[] {
            return this.productStore.$state.offers
        },

        getOffersDetails () {
            const offers = [] as IOfferResults[]
            const shops = []

            for (let i = 0; i < this.getOffers().length; i++) {
                const item = this.getOffers()[i] as IOffer
                if (item.shopId && shops.indexOf(item.shopId) === -1) {
                    shops.push(item.shopId)
                    const shop = item.shop as IShop
                    offers.push({
                        id: shop.id,
                        name: shop.name,
                        latitude: shop.latitude,
                        longitude: shop.longitude,
                        url: shop.url,
                        offers: this.getOffers().filter(o => {
                            return o.shopId === shop.id
                        }),
                    } as IOfferResults)
                }
            }
            this.logger.info(offers.length.toString())

            return offers
        },

        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        setItemDetails (id: number) {
            const x = this.itemDetails.indexOf(id)
            if (x === -1) {
                this.itemDetails.push(id)
                return true
            } else {
                this.itemDetails.splice(this.itemDetails.indexOf(id))
                return false
            }
        },

        showItemDetails (id: number) {
            return this.itemDetails.indexOf(id) !== -1
        },

        clickAddReview (id: number) {
            router.push('/review/create/' + id)
        },

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
        },

        clickAddOffer (id: number) {
            this.logger.info(id.toString())
            router.push('/offer/create/' + id)
        },

        getWatchlistIdFromProductId (id: number): number {
            this.logger.info('bookmarkIsActive')
            for (let i = 0; i < this.watchlistStore.watchlistCount; i++) {
                const x = this.watchlistStore.$state.watchlists[i] as IWatchlist
                if (id === x.productId) {
                    return x.id ?? 0
                }
            }

            return 0
        },

        bookmarkIsActive (id: number) {
            this.logger.info('bookmarkIsActive')
            for (let i = 0; i < this.watchlistStore.watchlistCount; i++) {
                const x = this.watchlistStore.$state.watchlists[i] as IWatchlist
                if (id === x.productId) {
                    return true
                }
            }

            return false
        },

        reviewIsActive (id: number) {
            this.logger.info('reviewIsActive')
            for (let i = 0; i < this.reviewStore.reviewCount; i++) {
                const x = this.reviewStore.$state.reviews[i] as IReview
                if (id === x.productId) {
                    return true
                }
            }

            return false
        },

        getCategoryImageByType (id: string) {
            return `/images/category/${id}.png`
        },

        getShopImageByType (url: string) {
            return `/images/shop/${url}`
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        }
    },
})
</script>
