<template>
    <RouterLink :to="{ name: 'home' }">
        <img src="https://via.placeholder.com/40x40.png?text=back" alt="back"/>
    </RouterLink>

    <h2>Products</h2>
    <div class="row">
        <div class="col-12 p-3">
            <h3>Price comparison app</h3>
            <div class="row">
                <div class="col-12">
                    <div class="input-group mb-3">
                        <input v-model="keyword" type="text" class="form-control" placeholder="Product barcode"
                               aria-label="Product title or barcode" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" @click="searchProductClicked" type="button">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="item of products" :key="item.id" class="border p-2 mb-4 row">
                <div class="col-3">
                    <img :src="getProductImageByBarcode(item.barcode)" alt="product"/>
                </div>
                <div class="col-6">
                    <h3>
                        <RouterLink :to="{ name: 'product-details', params: { id: item.id } }" class="text-dark">
                            {{ item.name }}
                        </RouterLink>
                    </h3>
                </div>
            </div>
            <div v-if="productCount === 0">
                Product not found.
                <RouterLink :to="{ name: 'product-create', params: { barcode: this.barcode } }" class="text-dark">
                    Add product
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ProductService } from '@/bll/service/ProductService'
import Logger from '@/util/logger'
import { IdentityService } from '@/bll/service/IdentityService'
import type { IProduct } from '@/dal/domain/IProduct'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        barcode: String
    },
    emits: [],
    setup() {
        const barcode: string | null = null
        const products: IProduct[] | null = null

        const logger = new Logger("ProductIndex")
        const productService = new ProductService()
        const identityService = new IdentityService()

        onMounted(() => {
            // this.logger.info('mounted')
            // if (this.barcode) {
            //     this.keyword = this.barcode
            //     this.productService.setKeyword(this.barcode)
            // }
            // const items = await this.productService.getAllByKeyword({ keyword: this.keyword } as ISearchItem)
            // this.products = items.data as IProduct[]
            // this.productCount = this.productService.size()
        })

        return {
            logger,
            barcode,
            products,
            productService,
            identityService,
            keyword: '',
            productCount: 0,
        }
    },
    methods: {
        async searchProductClicked (): Promise<void> {
            // await router.push({
            //     name: 'product',
            //     params: { keyword: this.keyword }
            // })
            // const items = await this.productService.getAllByKeyword({ keyword: this.keyword } as ISearchItem)
            // this.products = items.data as IProduct[]
            // this.productCount = this.productService.size()
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        }
    }

    // keyword = this.productService.getKeyword()
    // productCount = this.productService.size()


})

</script>
