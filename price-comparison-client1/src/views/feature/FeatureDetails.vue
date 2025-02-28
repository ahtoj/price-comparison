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
        <RouterLink :to="{ name: 'wishes' }">Back to Featurees</RouterLink>
    </div>
</template>

<script lang="ts">
import { useFeatureStore } from '@/stores/feature'
import { FeatureService } from '@/bll/service/FeatureService'
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
    setup(props: any) {
        const logger = new Logger("FeatureDetails")
        const id = props.id
        const wishesStore = useFeatureStore()
        const wishService = new FeatureService()
        onMounted(() => {
            logger.info('mounted')
            // this.wishesStore.$state.feature =
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
