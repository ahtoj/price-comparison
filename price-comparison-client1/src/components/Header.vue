<template>
    <header>
        <div class="row custom-header-bg">
            <div class="col-3 p-2">
                <RouterLink :to="{ name: back }" v-if="back != null && back !== ''">
                    <i class="bi bi-backspace"></i>
                </RouterLink>
            </div>
            <div class="col-6 p-2 text-center">
                {{ headerText }}
            </div>
            <div class="col-3 text-right">
                <div class="dropdown">
                    <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="bi bi-menu-down"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#" @click="clickStart">
                            <i class="bi bi-arrow-left-circle"></i> Avaleht
                        </a>
                        <a class="dropdown-item" href="#" @click="clickWatchlist">
                            <i class="bi bi-bookmark-plus"></i> Jälgimisnimekiri
                        </a>
                        <a class="dropdown-item" href="#" @click="clickAlarms">
                            <i class="bi bi-bell"></i> Hinnateavitused
                        </a>
                        <a class="dropdown-item" href="#" @click="clickReviews">
                            <i class="bi bi-star"></i> Hinnangud
                        </a>
                        <a class="dropdown-item" href="#" @click="clickNewOffer">
                            <i class="bi bi-filetype-xml"></i> Impordi pakkumine
                        </a>
                        <a class="dropdown-item" href="#" @click="clickNewShop">
                            <i class="bi bi-shop-window"></i> Uus müügikoht
                        </a>
                        <a class="dropdown-item" href="#" @click="clickNewShop">
                            <i class="bi bi-shop-window"></i> Uus kategooria
                        </a>
                        <a class="dropdown-item" href="#" @click="clickGeolocation">
                            <i class="bi bi-broadcast"></i> Uuenda koordinaate
                        </a>
                        <a class="dropdown-item" href="#" @click="logoutClicked">
                            <i class="bi bi-power"></i> Logi välja
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row custom-header-bg p-2 small">
            <div class="col-4">
                Minu asukoht
            </div>
            <div class="col-8">
                <div v-if="getCoords().latitude">
                    <button @click="clickGeolocation">
                        <i class="bi bi-broadcast"></i>
                        {{ getCoords().latitude }} {{ getCoords().longitude }}
                    </button>
                </div>
                <div v-else>
                    <button @click="clickGeolocation"><i class="bi bi-broadcast"></i> Uuenda</button>
                </div>
            </div>
        </div>
        <div class="row custom-header-search">
            <div class="col-12">
                <div class="input-group mb-3">
                    <input v-model="keyword" type="text" class="form-control" placeholder="Toote nimi või triipkood"
                           aria-label="Toote nimi või triipkood">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" @click="searchProduct" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                        <button class="btn btn-outline-secondary" @click="showScanner=!showScanner" type="button">
                            <i class="bi bi-qr-code-scan"></i>
                        </button>
                    </div>
                </div>
                <div v-if="showScanner">
                    <barcode-scanner :qrbox="100" :fps="10" @result="onScan"/>
                </div>
            </div>
        </div>
        <h1>{{ title }}</h1>
    </header>
</template>

<script>
import { useIdentityStore } from '@/stores/identity'
import Logger from '@/util/logger'
import router from '@/router'
import BarcodeScanner from '@/components/BarcodeScanner.vue'
import { useProductStore } from '@/stores/product'
import { ProductService } from '@/bll/service/ProductService'
import DistanceUtil from '@/util/distance-util'
import {defineComponent, onMounted} from "vue";
import {Html5QrcodeScanner} from "html5-qrcode";
import {useShopStore} from "@/stores/shop.js";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        BarcodeScanner,
    },
    props: {
        title: String,
        back: String,
    },
    setup(props) {

        const identityStore = useIdentityStore()
        const productStore = useProductStore()
        const logger = new Logger("Header")
        const showScanner = false
        const productService = new ProductService()
        const keyword = ''
        const headerText = ''
        const distanceUtil = new DistanceUtil()
        const title = props.title
        const shopStore = useShopStore()

        onMounted(async () => {
            this.keyword = this.getKeyword()
            this.headerText = this.getFirstname()
        })

        return {
            title,
            identityStore,
            productStore,
            keyword,
            headerText,
            distanceUtil,
            showScanner,
            productService,
            shopStore,
        }
    },
    methods: {
        onScan (decodedText, decodedResult) {
            this.logger.info('onscannn')
            this.keyword = decodedText
            this.searchProduct()
            this.logger.info(decodedResult)
            this.showScanner = false
        },
        clickGeolocation () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.logger.info(`Location: ${position.coords.latitude} ${position.coords.longitude}`)
                        this.identityStore.$state.currentLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }

                        this.shopService.getAll().then((items) => {
                            if (items.errorMsg !== undefined) {
                                this.errorMsg = items.errorMsg
                            } else {
                                const uniqueNodes = items.data
                                if (uniqueNodes && this.identityStore.getCoords()) {
                                    for (let i = 0; i < uniqueNodes.length; i++) {
                                        uniqueNodes[i].distance = this.distanceUtil.calculateDistance(
                                            this.identityStore.getCoords().latitude ?? 59.436962,
                                            this.identityStore.getCoords().longitude ?? 24.753574,
                                            uniqueNodes[i].latitude ?? 59.436962,
                                            uniqueNodes[i].longitude ?? 24.753574,
                                            'K'
                                        )
                                    }

                                    uniqueNodes.sort(function (a, b) {
                                        return (a.distance ?? 0) - (b.distance ?? 0)
                                    })

                                    this.shopStore.$state.shops = uniqueNodes
                                }
                            }
                        })
                    },
                    error => {
                        this.logger.error(error.message)
                    })
            } else {
                this.logger.warn('your browser does not support geolocation')
            }
        },

        getCoords () {
            return this.identityStore.$state.currentLocation
        },

        getFirstname () {
            return 'Ahto'
        },

        clickNewOffer () {
            router.push({
                name: 'product-import'
            })
        },

        clickNewShop () {
            router.push('/shop/create')
        },

        clickReviews () {
            router.push('/review')
        },

        clickAlarms () {
            router.push('/alarm')
        },

        clickWatchlist () {
            router.push('/watchlist')
        },

        isAuthenticated () {
            this.logger.info('is?')
            return this.identityStore.$state.jwt !== null
        },

        searchProduct () {
            this.logger.info('searchProduct')

            this.productStore.$state.keyword = this.keyword

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

            router.push({
                name: 'home'
            })
        },

        getKeyword () {
            return this.productStore.$state.keyword
        },

        clickStart () {
            this.productStore.$state.keyword = ''
            router.push({
                name: 'home'
            })
        },

        logoutClicked () {
            this.identityStore.clearJwt()
            router.push('/')
        },
    },
})
</script>

<style scoped>
.custom-header-bg {
    background-color: lightgrey;
}

.custom-header-bg button {
    border: 0;
}

.custom-header-search {
    padding: 10px;
}
</style>
