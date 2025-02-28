<template>
    <h2>Edit rating {{ id }}</h2>
    <div class="row">

    </div>

    <div>
        <RouterLink :to="{ name: 'ratings' }">Back to Shops</RouterLink>
    </div>
</template>

<script lang="ts">
import Logger from '@/util/logger'
import {defineComponent} from "vue";

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
        const logger = new Logger("ShopEdit")
        const id = props.id

        return {
            logger,
            id,
        }
    },
})
</script>
