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
        <RouterLink :to="{ name: 'wishes' }">Back to Metrices</RouterLink>
    </div>
</template>

<script lang="ts">
import { MetricService } from '@/bll/service/MetricService'
import { useMetricStore } from '@/stores/metric'
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
    setup(props:any) {
        const logger = new Logger("MetricDetails")
        const id = props.id
        const wishesStore = useMetricStore()
        const wishService = new MetricService()

        onMounted(() => {
            logger.info('mounted')
            // this.wishesStore.$state.metric =
            //     await this.wishService.get(this.id)
        })

        return {
            logger,
            id,
            wishesStore,
            wishService,
        }
    },
})
</script>
