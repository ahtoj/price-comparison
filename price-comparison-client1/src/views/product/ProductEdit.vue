<template>
    <h2>Edit product {{ id }}</h2>
    <div class="row">

    </div>
</template>

<script lang="ts">
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
        const logger = new Logger("ProductEdit")
        const id = props.id

        return {
            logger,
            id,
        }
    },
})
</script>
