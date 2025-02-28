<template>
    <h2>Edit alarm {{ id }}</h2>
    <div class="row">

    </div>

    <div>
        <RouterLink :to="{ name: 'alarms' }">Back to Alarms</RouterLink>
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
        const logger = new Logger("AlarmEdit")
        const id = props.id

        return {
            logger,
            id,
        }
    },
})
</script>
