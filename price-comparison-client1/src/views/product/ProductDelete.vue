<template>
    <h4>Delete product {{ id }}</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Delete" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ProductService } from '@/bll/service/ProductService'
import { useProductStore } from '@/stores/product'
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
    setup(props:any) {
        const logger = new Logger("ProductDelete")
        const id = props.id
        const productsStore = useProductStore()
        const productService = new ProductService()

        const errorMsg: string | null = null

        return {
            logger,
            id,
            productsStore,
            productService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            // await this.productService.delete(this.id)

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.productsStore.$state.products =
                    await this.productService.getAll()

                this.$router.push('/products')
            }
             */
        }
    }
})
</script>
