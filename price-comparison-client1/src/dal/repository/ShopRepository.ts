import { BaseRepository } from '@/dal/repository/BaseRepository'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IShopRepository } from '@/dal/repository/model/IShopRepository'
import httpCLient from '@/util/http-client'
import { AxiosError } from 'axios'
import type { IShop } from '@/dal/domain/IShop'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class ShopRepository extends BaseRepository<IShop> implements IShopRepository {
    constructor () {
        super('v1/shop')
    }

    async findByName (entity: IShop): Promise<IServiceResult<IShop[]>> {
        this.logger.info('findByName')

        let response
        try {
            response = await httpCLient.post(`/${this._path}/search`, entity, {
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
