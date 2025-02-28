<template>
    <h2>Details alarm {{ id }}</h2>
    <div class="row">
        <div class="col-md-12">
            <div>
                <RouterLink :to="{ name: 'alarms-details', params: { id: id } }">Details</RouterLink>
                |
                <RouterLink :to="{ name: 'alarms-edit', params: { id: id } }">Edit</RouterLink>
                |
                <RouterLink :to="{ name: 'alarms-delete', params: { id: id } }">Delete</RouterLink>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'alarms' }">Back to Alarms</RouterLink>
    </div>
</template>

<script lang="ts">
import { AlarmService } from '@/bll/service/AlarmService'
import { useAlarmStore } from '@/stores/alarm'
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
        const logger = new Logger("AlarmDetails")
        const id = props.id
        const alarmsStore = useAlarmStore()
        const alarmService = new AlarmService()

        return {
            logger,
            id,
            alarmsStore,
            alarmService,
        }
    },
})

</script>
