import { BaseRepository } from '@/dal/repository/BaseRepository'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import httpCLient from '@/util/http-client'
import { AxiosError } from 'axios'
import type { IPublicStats } from '@/dal/domain/IPublicStats'
import type { IStatsRepository } from '@/dal/repository/model/IStatsRepository'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class StatsRepository extends BaseRepository<IPublicStats> implements IStatsRepository {
    constructor () {
        super('v1/stats')
    }

    async getPublicStats (): Promise<IServiceResult<IPublicStats>> {
        let response
        try {
            response = await httpCLient.get(`/${this._path}/public`, {
                headers: {
                    Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token,
                }
            })
        } catch (e:any) {
            return {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.message,
            }
        }

        return {
            status: response.status,
            data: response.data.details,
        }
    }
}
