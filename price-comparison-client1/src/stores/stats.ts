import { defineStore } from 'pinia'
import type {IPublicStats} from "@/dal/domain/IPublicStats.ts";

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export const useStatsStore = defineStore("stats", {
    state: () => {
        return {
            publicStats: {} as IPublicStats
        }
    },
    actions: {
        getPublicStats() {
            return this.publicStats
        },
        updatePublicStats(stats : IPublicStats) {
            this.publicStats = stats
        }
    },
})
