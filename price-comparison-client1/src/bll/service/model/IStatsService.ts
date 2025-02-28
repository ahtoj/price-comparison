import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IPublicStats } from '@/dal/domain/IPublicStats'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export interface IStatsService {
    getPublicStats (): Promise<IServiceResult<IPublicStats>>
}
