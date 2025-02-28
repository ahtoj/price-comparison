<template>
    <h2>List of wishes</h2>
    <p>
        <RouterLink :to="{ name: 'wishes-create' }">Create new</RouterLink>
    </p>
    <table class="table">
        <thead>
        <tr>
            <th>Id</th>
            <th>Customer Id</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item of metricStore.metrics" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.categoryId }}</td>
            <td>
                <RouterLink :to="{ name: 'wishes-details', params: { id: item.id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-edit', params: { id: item.id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'wishes-delete', params: { id: item.id } }">Delete</RouterLink>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { useMetricStore } from '@/stores/metric'
import { MetricService } from '@/bll/service/MetricService'
import Logger from '@/util/logger'
import {defineComponent, onMounted} from "vue";

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export default defineComponent({
    components: {},
    props: {},
    emits: [],
    setup() {
        const logger = new Logger("MetricIndex")
        const metricStore = useMetricStore()
        const wishService = new MetricService()

        onMounted(() => {
            logger.info('mounted')
            // this.wishesStore.$state.metrics =
            //     await this.wishService.getAll()
        })

        return {
            logger,
            metricStore,
            wishService,
        }
    },
})
</script>
