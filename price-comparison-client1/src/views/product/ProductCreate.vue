<template>
    <RouterLink :to="{ name: 'home' }">
        <img src="https://via.placeholder.com/40x40.png?text=back" alt="back"/>
    </RouterLink>

    <h2>Create products</h2>
    <div class="row">
        <div class="col-md-12">
            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Barcode</label>
                <input type="text" class="col-sm-2" v-model="barcode"/>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Name</label>
                <input type="text" class="col-sm-2" v-model="name"/>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Description</label>
                <input type="text" class="col-sm-2" v-model="description"/>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Category</label>
                <select class="col-sm-2" v-model="categoryId">
                    <option v-for="option in getCategoryList()" v-bind:key="option.id" :value="option.id">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { CategoryService } from '@/bll/service/CategoryService'
import { ProductService } from '@/bll/service/ProductService'
import type { IProduct } from '@/dal/domain/IProduct'
import type { ICategory } from '@/dal/domain/ICategory'
import Logger from '@/util/logger'
import router from '@/router'
import { useCategoryStore } from '@/stores/category'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    name: "ProductCreate",
    components: {},
    props: {
        id: Number,
    },
    emits: [],
    setup() {
        const logger = new Logger("ProductCreate")
        const productService = new ProductService()
        const categoryService = new CategoryService()
        const categoryStore = useCategoryStore()

        const barcode = ''
        const name = ''
        const description = ''
        const categoryId = 0
        let errorMsg: string | null = null

        onMounted(() => {
            logger.info('mounted')
            categoryService.getAllByCategoryId(null).then((items) => {
                if (items.errorMsg !== undefined) {
                    errorMsg = items.errorMsg
                } else {
                    if (items.data) {
                        categoryStore.$state.categories = items.data
                    }
                }
            })
        })

        return {
            logger,
            productService,
            categoryService,
            categoryStore,
            barcode,
            name,
            description,
            categoryId,
            errorMsg,

        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const obj: IProduct = {
                categoryId: this.categoryId,
                barcode: this.barcode,
                name: this.name,
                description: this.description
            }
            this.logger.info(obj as string)

            const res = await this.productService.add(obj)

            if (res.status == null || res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                await router.push('/')
            }
        },
        getCategoryList (): ICategory[] {
            return this.categoryStore.$state.categories
        },
    }
})
</script>
