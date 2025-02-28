<template>
    <h2>Details wish {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'wishes-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'wishes' }">Back to Prices</RouterLink>
    </div>
</template>

<script lang="ts">
import { usePriceStore } from '@/stores/price'
import { PriceService } from '@/bll/service/PriceService'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

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
        const logger = new Logger("PriceDetails")
        const id = props.id
        const wishesStore = usePriceStore()
        const wishService = new PriceService()

        onMounted(() => {
            logger.info('mounted')
            // this.wishesStore.$state.price =
            //     await this.wishService.get(this.id)
        })

        return {
            logger,
            id,
            wishesStore,
            wishService,
        }
    },
    methods: {

    }
})
</script>
