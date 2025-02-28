<template>
    <h2>Edit account {{ id }}</h2>
    <div class="row">

    </div>

    <div>
        <RouterLink :to="{ name: 'accounts' }">Back to Accounts</RouterLink>
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
    setup(props: any) {
        const logger = new Logger("AccountEdit")
        const id = props.id
        return {
            logger,
            id,
        }
    }
})
</script>
