<template>
    <h4>Delete alarm {{ id }}</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Delete" class="btn btn-primary"/>
                </div>
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
        id: Number,
    },
    emits: [],
    setup(props: any) {
        const logger = new Logger("AlarmDelete")
        const id = props.id
        const alarmsStore = useAlarmStore()
        const alarmService = new AlarmService()

        const errorMsg: string | null = null

        return {
            logger,
            id,
            alarmsStore,
            alarmService,
            errorMsg,
        }
    },
    methods: {
        async submitClicked (): Promise<void> {
            this.logger.info('submitClicked')

            await this.alarmService.delete(this.id)

            /*
            if (res.status >= 300) {
                this.errorMsg = res.status + ' ' + res.errorMsg
            } else {
                this.alarmsStore.$state.alarms =
                    await this.alarmService.getAll()

                this.$router.push('/alarms')
            }
             */
        }
    }
})
</script>
