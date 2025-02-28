<template>
    <h2>Details rating {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'ratings-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'ratings-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'ratings-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'ratings' }">Back to Shops</RouterLink>
    </div>
</template>

<script lang="ts">
import { useShopStore } from '@/stores/shop'
import { ShopService } from '@/bll/service/ShopService'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 31.03.2023
 */
export default defineComponent({
    components: {},
    props: {
        id: String
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("ShopDetails")
        const id = props.id
        const shopStore = useShopStore()
        const shopService = new ShopService()

        onMounted(() => {
            logger.info('mounted')
            // const item = await this.shopService.get(this.id)
            // this.shopStore.$state.shop = item.data as IShop
        })

        return {
            logger,
            id,
            shopStore,
            shopService,
        }
    },
})

</script>
