import { BaseRepository } from '@/dal/repository/BaseRepository'
import type { IOfferRepository } from '@/dal/repository/model/IOfferRepository'
import httpCLient from '@/util/http-client'
import { AxiosError } from 'axios'
import type { IOffer } from '@/dal/domain/IOffer'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class OfferRepository extends BaseRepository<IOffer> implements IOfferRepository {
    constructor () {
        super('v1/offer')
    }

    async getOfferListById (productId: number): Promise<IServiceResult<IOffer[]>> {
        this.logger.info('findByName')

        let response
        try {
            response = await httpCLient.get(`/${this._path}/product/${productId}`, {
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
