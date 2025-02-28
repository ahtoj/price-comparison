<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Uute pakkumiste lisamine</h4>
    <div class="row">
        <div class="col-md-12">
            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Müügikoht</label>
                <select class="col-sm-2" v-model="storeId">
                    <option v-for="option in getShopList()" v-bind:key="option.id" :value="option.id">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-4 p-2 control-label">Kategooria</label>
                <select class="col-8" v-model="categoryId">
                    <option v-for="option in getCategoryList()" v-bind:key="option.id" :value="option.id">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">URL (json,csv,xml)</label>
                <input type="text" class="form-control" v-model="url">
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Kopeeri/kleebi vabatekstina</label>
                <textarea v-model="listDataString" class="form-control" style="min-width: 100%"></textarea>
            </div>
            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Import" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ProductService } from '@/bll/service/ProductService'
import Logger from '@/util/logger'
import router from '@/router'
import type { IProductImport } from '@/dal/domain/IProductImport'
import type { IShop } from '@/dal/domain/IShop'
import { useShopStore } from '@/stores/shop'
import { ShopService } from '@/bll/service/ShopService'
import DistanceUtil from '@/util/distance-util'
import { useIdentityStore } from '@/stores/identity'
import { IdentityService } from '@/bll/service/IdentityService'
import Header from '@/components/Header.vue'
import { CategoryService } from '@/bll/service/CategoryService'
import { useCategoryStore } from '@/stores/category'
import type { ICategory } from '@/dal/domain/ICategory'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 15.04.2023
 */
export default defineComponent({
    components: {
        Header,
    },
    props: {
        barcode: String,
    },
    emits: [],
    setup() {
        const logger = new Logger("ProductImport")
        const productService = new ProductService()
        const shopService = new ShopService()
        const shopStore = useShopStore()
        const identityStore = useIdentityStore()
        const identityService = new IdentityService()
        const categoryService = new CategoryService()
        const categoryStore = useCategoryStore()

        const listDataString = 'barcode;name;description;url;price'
        const storeId = 0
        let categoryId = 0
        let url = ''
        let errorMsg: string | null = null

        onMounted(() => {
            logger.info('mounted')
            const distanceUtil = new DistanceUtil()

            shopService.getAll().then((items: any) => {
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
                                "K"
                            );
                        }

                        uniqueNodes.sort(function(a, b) {
                            return (a.distance ?? 0) - (b.distance ?? 0);
                        });

                        shopStore.$state.shops = uniqueNodes
                    }
                }
            })

            categoryService.getAll().then((item : any) => {
                if (item.errorMsg !== undefined) {
                    errorMsg = item.errorMsg
                } else {
                    if (item.data) {
                        categoryStore.$state.categories = item.data
                    }
                }
            })
        })

        return {
            logger,
            productService,
            shopService,
            shopStore,
            identityStore,
            identityService,
            categoryService,
            categoryStore,
            listDataString,
            storeId,
            categoryId,
            url,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            const obj: IProductImport = {
                storeId: this.storeId,
                productImportItems: this.convertToJson(this.listDataString),
            }
            this.logger.info(obj as string)

            await this.productService.import(obj).then((items:any) => {
                if (items.errorMsg !== undefined) {
                    this.errorMsg = items.errorMsg
                } else {
                    if (items.data) {
                        router.push('/')
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

        convertToJson (input: string) {
            const lines = input.split(/\n/)
            const header = lines[0].split(/\\t|\n|;|\t/)
            const output = lines.slice(1).map(line => {
                const fields = line.split(/\\t|\n|;|\t/)
                return Object.fromEntries(header.map((h, i) => [h, fields[i]]))
            })

            return output
        },

        isAuthenticated (): boolean {
            return this.identityService.isAuthenticated()
        }

    }

})
</script>
