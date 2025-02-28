<script lang="ts">
import { OfferService } from '@/bll/service/OfferService'
import { useOfferStore } from '@/stores/offer'
import { IdentityService } from '@/bll/service/IdentityService'
import type { IOffer } from '@/dal/domain/IOffer'
import type { IPrice } from '@/dal/domain/IPrice'
import type { IShop } from '@/dal/domain/IShop'
import { ShopService } from '@/bll/service/ShopService'
import { useShopStore } from '@/stores/shop'
import { useIdentityStore } from '@/stores/identity'
import { useProductStore } from '@/stores/product'
import { ProductService } from '@/bll/service/ProductService'
import type { ICategory } from '@/dal/domain/ICategory'
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import HttpClient from '@/util/http-client'
import Logger from '@/util/logger'
import Header from '@/components/Header.vue'
import router from '@/router'
import DistanceUtil from '@/util/distance-util'
import UploadImage from '@/components/UploadImage.vue'
import BarcodeScanner from '@/components/BarcodeScanner.vue'
import {defineComponent, onMounted} from "vue";
import {parse} from "papaparse";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {
        BarcodeScanner,
        Header,
        UploadImage,
    },
    props: {
        id: Number,
    },
    emits: [],
    data () {
        return {
            progress: 0,
        }
    },
    setup(props) {
        const logger = new Logger("OfferCreate")
        const offerStore = useOfferStore()
        const offerService = new OfferService()
        const identityStore = useIdentityStore()
        const identityService = new IdentityService()
        const shopService = new ShopService()
        const productService = new ProductService()
        const categoryService = new CategoryService()
        const shopStore = useShopStore()
        const productStore = useProductStore()
        const categoryStore = useCategoryStore()
        const distanceUtil = new DistanceUtil()

        const showScanner = false
        const showScanner2 = false
        let errorMsg: string | null = null
        const uploadFile = ''
        const parsed = false
        const shopId: number | undefined = undefined
        const categoryId: number | undefined = undefined
        const price: number | undefined = undefined
        let name: string | undefined = undefined
        let barcode: string | undefined = undefined
        const productImage: string | undefined = undefined
        const id = props.id

        onMounted(() => {
            logger.info('mounted')
            const distanceUtil = new DistanceUtil()

            if (id) {
                productService.getById(id).then((item) => {
                    if (item.errorMsg !== undefined) {
                        errorMsg = item.errorMsg
                    } else {
                        if (item.data) {
                            productStore.$state.product = item.data
                        }
                    }
                })
            }

            shopService.getAll().then((items) => {
                if (items.errorMsg !== undefined) {
                    errorMsg = items.errorMsg
                } else {
                    const uniqueNodes = items.data
                    if (uniqueNodes && identityStore.getCoords()) {
                        for (let i = 0; i < uniqueNodes.length; i++) {
                            uniqueNodes[i].distance = distanceUtil.calculateDistance(
                                identityStore.getCoords().latitude ?? 59.436962,
                                identityStore.getCoords().longitude ?? 24.753574,
                                uniqueNodes[i].latitude ?? 59.436962,
                                uniqueNodes[i].longitude ?? 24.753574,
                                'K'
                            )
                        }

                        uniqueNodes.sort(function (a, b) {
                            return (a.distance ?? 0) - (b.distance ?? 0)
                        })

                        shopStore.$state.shops = uniqueNodes
                    }
                }
            })

            categoryService.getAll().then((item) => {
                if (item.errorMsg !== undefined) {
                    errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        categoryStore.$state.categories = item.data
                    }
                }
            })

            const initialOffer = offerStore.$state.offer
            if (initialOffer.name) {
                name = initialOffer.name
            }
            if (initialOffer.barcode) {
                barcode = initialOffer.barcode
            }
        })

        return {
            logger,
            offerStore,
            offerService,
            identityStore,
            identityService,
            shopService,
            shopStore,
            productService,
            categoryService,
            categoryStore,
            distanceUtil,
            showScanner,
            showScanner2,
            errorMsg,
            uploadFile,
            parsed,
            shopId,
            categoryId,
            price,
            name,
            barcode,
            productImage,
            id,
        }
    },
    methods: {
        onScan (decodedText: any, decodedResult: any) {
            this.logger.info('onscannn')
            this.barcode = decodedText
            this.logger.info(decodedResult)
            this.showScanner = false
        },

        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const obj: IOffer = {
                name: this.name,
                barcode: this.barcode,
                productId: this.id,
                shopId: this.shopId,
                categoryId: this.categoryId,
                price: {
                    amount: this.price
                } as IPrice,
            }
            this.logger.info(obj as string)

            if (this.offerStore.$state.uploadedImage) {
                fetch(this.offerStore.$state.uploadedImage)
                    .then(res => res.blob())
                    .then(blob => {
                        this.offerService
                            .upload(this.barcode ?? '', blob, 0)
                            .then((r:any) => {
                                if (r.data) {
                                    this.logger.log(r.data)
                                }
                            })
                    })
                    .catch(err => console.log(err))
            }

            await this.offerService.add(obj).then((item : any) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        router.push('/product/details/' + item.data.productId)
                    }
                }
            })
        },

        getShopList (): IShop[] {
            return this.shopStore.$state.shops
        },

        getCategoryList (): ICategory[] {
            return this.categoryStore.$state.categories
        },

        parseFile () {
            parse(this.uploadFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results: any) => {
                    this.content = results
                    this.parsed = true
                }
            })
        },

        async submitFile () {
            const formData = new FormData()

            formData.append('file', this.uploadFile)

            await HttpClient.post('/preview-file',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
        },

        get isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        },

        getProduct () {
            return this.productStore.$state.product
        },

        getCategoryImageByType (id: string) {
            return `/images/category/${id}.png`
        },

        getShopImageByType (url: string) {
            return `/images/shop/${url}`
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        },

        goToImports () {
            router.push({
                name: 'product-import'
            })
        }
    }
})
</script>

<style>
.custom-offer-create-image #qr-code-full-region__header_message {
    display: none;
}
</style>

<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Uue pakkumise lisamine</h4>
    <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
        <ul>
            <li>{{ errorMsg }}</li>
        </ul>
    </div>
    <div v-if="id !== undefined">
        <div class="row p-3">
            <div class="col-12 text-center">
                <img :src="getProductImageByBarcode(getProduct().barcode)" alt="" height="164"/>
            </div>
        </div>
        <div class="row p-3">
            <div class="col-4 p-2">Toote nimi</div>
            <div class="col-8 p-2">{{ getProduct().name }}</div>
        </div>
        <div class="row p-3">
            <div class="col-4 p-2">Triipkood</div>
            <div class="col-8 p-2">{{ getProduct().barcode }}</div>
        </div>
    </div>
    <div v-if="id === undefined">
        <div class="form-group">
            <label class="col-4 p-2 control-label">Toote nimi</label>
            <input type="text" class="col-8" v-model="name"/>
        </div>
        <div class="form-group row p-3">
            <label class="col-4 p-2 control-label">Triipkood</label>
            <div class="col-8 p-2">
                <div class="input-group mb-3">
                    <input v-model="barcode" type="text" class="form-control" aria-label="triipkood">
                    <div class="input-group-append">
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
        <div class="form-group row p-3">
            <div class="col-4 p-2 control-label">
                <label>Toote pilt</label>
            </div>
            <div class="col-8 p-2">
                <upload-image/>
            </div>
        </div>
        <div class="form-group">
            <label class="col-4 p-2 control-label">Kategooria</label>
            <select class="col-8" v-model="categoryId">
                <option v-for="option in getCategoryList()" v-bind:key="option.id" :value="option.id">
                    {{ option.name }}
                </option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-4 p-2 control-label">Pood</label>
        <select class="col-8" v-model="shopId">
            <option v-for="option in getShopList()" v-bind:key="option.id" :value="option.id">
                {{ option.name }} <span v-if="option.distance"> &nbsp; {{
                    distanceUtil.round(option.distance)
                }}km</span>
            </option>
        </select>
    </div>
    <div class="form-group">
        <label class="col-4 p-2 control-label">Hind</label>
        <input type="text" class="col-8" v-model="price" style="width: 100px;"/>
    </div>
    <div>
        <div class="row">
            <div class="col-4"></div>
            <div class="col-6">
                <input @click="submitClicked()" type="submit" value="Lisa pakkumine" class="btn btn-primary"/>
            </div>
            <div class="col-2">
                <button @click="goToImports()">
                    <i class="bi bi-filetype-xml"></i>
                </button>
            </div>
        </div>
    </div>
</template>
