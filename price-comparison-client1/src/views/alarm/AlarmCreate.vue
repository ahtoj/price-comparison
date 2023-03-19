<template>
    <h4>Create alarm</h4>
    <div class="row">
        <div class="col-md-12">

            <div v-if="errorMsg != null" class="text-danger validation-summary-errors" data-valmsg-summary="true">
                <ul>
                    <li>{{ errorMsg }}</li>
                </ul>
            </div>

            <div>
                <div class="form-group">
                    <input @click="submitClicked()" type="submit" value="Create" class="btn btn-primary"/>
                </div>
            </div>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'alarms' }">Back to Alarms</RouterLink>
    </div>
</template>

<script lang="ts">
import { AlarmService } from '@/services/AlarmService'
import { useAlarmsStore } from '@/stores/alarms'
import { Options, Vue } from 'vue-class-component'

@Options({
    components: {},
    props: {},
    emits: [],
})
export default class AlarmCreate extends Vue {
    alarmsStore = useAlarmsStore()
    alarmService = new AlarmService()
    // alarmService = new AlarmService()

    errorMsg: string | null = null

    async submitClicked (): Promise<void> {
        console.log('submitClicked')

        const res = await this.alarmService.add(
            {
            }
        )

        if (res.status >= 300) {
            this.errorMsg = res.status + ' ' + res.errorMsg
        } else {
            // this.alarmsStore.$state.alarms =
            //     await this.alarmService.getAll()

            this.$router.push('/alarms')
        }
    }
}
</script>