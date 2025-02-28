<template>
    <Header v-if="isAuthenticated" title="" back="home"/>

    <h4>Uute pakkumiste lisamine</h4>
    <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
        <ul>
            <li>{{ errorMsg }}</li>
        </ul>
    </div>
    <div class="row">
        <label class="col-6">Store</label>
        <select class="col-6" v-model="storeId">
            <option v-for="option in getShopList()" v-bind:key="option.id" :value="option.id">
                {{ option.name }}
            </option>
        </select>
    </div>
    <div class="row">
        <label class="col-6">Import as plain text</label>
        <textarea class="col-6" v-model="listDataString"></textarea>
    </div>
    <div class="row">
        <div class="col-6">
            <input @click="submitClicked()" type="submit" value="Import" class="btn btn-primary"/>
        </div>
    </div>
</template>

<script lang="ts">
import { ProductService } from '@/bll/service/ProductService'
import Logger from '@/util/logger'
import router from '@/router'
import type { IShop } from '@/dal/domain/IShop'
import { useShopStore } from '@/stores/shop'
import { ShopService } from '@/bll/service/ShopService'
import DistanceUtil from '@/util/distance-util'
import { useIdentityStore } from '@/stores/identity'
import { IdentityService } from '@/bll/service/IdentityService'
import type { IProductImport } from '@/dal/domain/IProductImport'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 15.04.2023
 */
export default defineComponent({
    components: {},
    props: {
        barcode: String,
    },
    emits: [],
    setup() {
        const logger = new Logger("OfferImport")
        const productService = new ProductService()
        const shopService = new ShopService()
        const shopStore = useShopStore()
        const identityStore = useIdentityStore()
        const identityService = new IdentityService()

        const listDataString = 'barcode;name;description;url;price'
        const storeId = 0
        let errorMsg: string | null = null

        onMounted(() => {
            logger.info('mounted')
            const distanceUtil = new DistanceUtil()

            shopService.getAll().then((items) => {
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

        })

        return {
            logger,
            productService,
            shopService,
            shopStore,
            identityStore,
            identityService,
            listDataString,
            storeId,
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

            await this.productService.import(obj).then((items) => {
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
    },
})
</script>
