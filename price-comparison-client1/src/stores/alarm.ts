import { defineStore } from 'pinia'
import { IAlarm } from '@/dal/domain/IAlarm'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export const useAlarmStore = defineStore({
    id: 'alarms',
    state: () => ({
        alarm: {} as IAlarm,
        alarms: [] as IAlarm[],
    }),
    getters: {
        alarmCount: (state) => state.alarms.length,
    },
    actions: {
        add (alarm: IAlarm) {
            this.alarms.push(alarm)
        },
        remove (alarmId: number) {
            this.alarms = this.alarms.filter((item: IAlarm) => {
                return item.id !== alarmId
            })
        },
    },
})
