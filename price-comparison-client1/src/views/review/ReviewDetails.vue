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
        <RouterLink :to="{ name: 'ratings' }">Back to Reviews</RouterLink>
    </div>
</template>

<script lang="ts">
import { ReviewService } from '@/bll/service/ReviewService'
import { useReviewStore } from '@/stores/review'
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
        const logger = new Logger("ReviewDetails")
        const id = props.id
        const reviewStore = useReviewStore()
        const ratingService = new ReviewService()

        return {
            logger,
            id,
            reviewStore,
            ratingService,
        }
    },

})
</script>
