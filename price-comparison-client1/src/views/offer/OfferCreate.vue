<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { OfferService } from '@/bll/service/OfferService'
import { useOfferStore } from '@/stores/offer'
import { IdentityService } from '@/bll/service/IdentityService'
import { IOffer } from '@/dal/domain/IOffer'
import { IPrice } from '@/dal/domain/IPrice'
import { IShop } from '@/dal/domain/IShop'
import { ShopService } from '@/bll/service/ShopService'
import { useShopStore } from '@/stores/shop'
import { useIdentityStore } from '@/stores/identity'
import { useProductStore } from '@/stores/product'
import { ProductService } from '@/bll/service/ProductService'
import { ICategory } from '@/dal/domain/ICategory'
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import HttpClient from '@/util/http-client'
import Papa from 'papaparse'
import Logger from '@/util/logger'
import Header from '@/components/Header.vue'
import router from '@/router'
import DistanceUtil from '@/util/distance-util'
import UploadImage from '@/components/UploadImage.vue'
import BarcodeScanner from '@/components/BarcodeScanner.vue'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
@Options({
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
    methods: {
        onScan (decodedText: any, decodedResult: any) {
            this.logger.info('onscannn')
            this.barcode = decodedText
            this.logger.info(decodedResult)
            this.showScanner = false
        },
    },
})
export default class OfferCreate extends Vue {
    private logger = new Logger(OfferCreate.name)
    offerStore = useOfferStore()
    offerService = new OfferService()
    private identityStore = useIdentityStore()
    private identityService = new IdentityService()
    private shopService = new ShopService()
    private productService = new ProductService()
    private categoryService = new CategoryService()
    private shopStore = useShopStore()
    private productStore = useProductStore()
    private categoryStore = useCategoryStore()
    distanceUtil = new DistanceUtil()

    showScanner = false
    showScanner2 = false
    errorMsg: string | null = null
    uploadFile = ''
    content = []
    parsed = false
    shopId: number | undefined = undefined
    categoryId: number | undefined = undefined
    price: number | undefined = undefined
    name: string | undefined = undefined
    barcode: string | undefined = undefined
    productImage: string | undefined = undefined
    id!: number

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
                        .then(r => {
                            if (r.data) {
                                this.logger.log(r.data)
                            }
                        })
                })
                .catch(err => console.log(err))
        }

        await this.offerService.add(obj).then((item) => {
            if (item.errorMsg !== undefined) {
                this.errorMsg = item.errorMsg
            } else {
                if (item.data) {
                    router.push('/product/details/' + item.data.productId)
                }
            }
        })
    }

    mounted (): void {
        this.logger.info('mounted')
        const distanceUtil = new DistanceUtil()

        if (this.id) {
            this.productService.getById(this.id).then((item) => {
                if (item.errorMsg !== undefined) {
                    this.errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        this.productStore.$state.product = item.data
                    }
                }
            })
        }

        this.shopService.getAll().then((items) => {
            if (items.errorMsg !== undefined) {
                this.errorMsg = items.errorMsg
            } else {
                const uniqueNodes = items.data
                if (uniqueNodes && this.identityStore.getCoords()) {
                    for (let i = 0; i < uniqueNodes.length; i++) {
                        uniqueNodes[i].distance = distanceUtil.calculateDistance(
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

        this.categoryService.getAll().then((item) => {
            if (item.errorMsg !== undefined) {
                this.errorMsg = item.errorMsg
            } else {
                if (item.data) {
                    this.categoryStore.$state.categories = item.data
                }
            }
        })

        const initialOffer = this.offerStore.$state.offer
        if (initialOffer.name) {
            this.name = initialOffer.name
        }
        if (initialOffer.barcode) {
            this.barcode = initialOffer.barcode
        }
    }

    getShopList (): IShop[] {
        return this.shopStore.$state.shops
    }

    getCategoryList (): ICategory[] {
        return this.categoryStore.$state.categories
    }

    parseFile () {
        Papa.parse(this.uploadFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
                this.content = results
                this.parsed = true
            }
        })
    }

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
    }

    get isAuthenticated (): boolean {
        return this.identityService.isAuthenticated()
    }

    getProduct () {
        return this.productStore.$state.product
    }

    getCategoryImageByType (id: string) {
        return `/images/category/${id}.png`
    }

    getShopImageByType (url: string) {
        return `/images/shop/${url}`
    }

    getProductImageByBarcode (id: string) {
        return `/images/product/${id}.jpg`
    }

    goToImports () {
        router.push({
            name: 'product-import'
        })
    }
}
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
