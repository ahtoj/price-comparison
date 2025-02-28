<template>
    <div class="row">
        <div class="col-lg-8 p-4">
            <h2>{{ name }}</h2>

            <div v-if="categories.length > 0">
                <h3>Sub-category</h3>
                <div v-for="item of categories" :key="item.id" class="border p-2 mb-4 row">
                    <div class="col-3">
                        <img src="https://via.placeholder.com/75x30.png?text=category" alt="category"/>
                    </div>
                    <div class="col-6">
                        <h3>
                            <RouterLink :to="{ name: 'categories-details', params: { id: item.id } }">
                                {{ item.name }}
                            </RouterLink>
                        </h3>
                    </div>
                    <div v-if="identityStore.isAdmin()" class="col-3 small">
                        For admin:
                        <RouterLink :to="{ name: 'categories-details', params: { id: item.id } }">Details</RouterLink>
                        |
                        <RouterLink :to="{ name: 'categories-edit', params: { id: item.id } }">Edit</RouterLink>
                        |
                        <RouterLink :to="{ name: 'categories-delete', params: { id: item.id } }">Delete</RouterLink>
                    </div>
                </div>
            </div>

            <div v-for="item of products" :key="item.id" class="border p-2 mb-4 row">
                <div class="col-3">
                    <img :src="getProductImageByBarcode(item.barcode)" alt="product"/>
                </div>
                <div class="col-6">
                    <h4>
                        <RouterLink :to="{ name: 'products-details', params: { id: item.id } }">{{
                                item.name
                            }}
                        </RouterLink>
                    </h4>
                </div>
                <div class="col-3">
                    €{{ item.bestPrice > 0 ? item.bestPrice : '' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { ProductService } from '@/bll/service/ProductService'
import { useIdentityStore } from '@/stores/identity'
import type { ICategory } from '@/dal/domain/ICategory'
import type { IProduct } from '@/dal/domain/IProduct'
import Logger from '@/util/logger'
import {defineComponent} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: String
    },
    emits: [],
    setup(props) {
        const logger = new Logger("CategoryDetails")
        const id = props.id
        const categoriesStore = useCategoryStore()
        const categoryService = new CategoryService()
        const productsStore = useProductStore()
        const productService = new ProductService()
        const identityStore = useIdentityStore()
        const form = {
            filterByMinPrice: 0,
            filterByMaxPrice: 10000
        }
        const categories: ICategory[] = []
        const products: IProduct[] = []
        const category: ICategory | null = null
        const name: string | undefined = ''

        return {
            logger,
            id,
            categoriesStore,
            categoryService,
            productsStore,
            productService,
            identityStore,
            form,
            categories,
            products,
            category,
            name,
        }
    },
    methods: {

        isAuthenticated (): boolean {
            return this.identityStore.getJwt() !== null
        },

        isAdmin (): boolean {
            return this.identityStore.isAdmin()
        },

        async applyPriceRangeFilter (): Promise<void> {
            // this.products =
            //     await this.productService.getAllByCategoryIdAndFilters(this.id, this.form as IFormProductPage)
        },

        getProductImageByBarcode (id: string) {
            return `/images/product/${id}.jpg`
        }
    }
})

</script>
