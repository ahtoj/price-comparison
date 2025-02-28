import { BaseRepository } from '@/dal/repository/BaseRepository'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IProductRepository } from '@/dal/repository/model/IProductRepository'
import httpCLient from '@/util/http-client'
import { AxiosError } from 'axios'
import type { IProduct } from '@/dal/domain/IProduct'
import type { IProductImport } from '@/dal/domain/IProductImport'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class ProductRepository extends BaseRepository<IProduct> implements IProductRepository {
    constructor () {
        super('v1/product')
    }

    async findByName (entity: IProduct): Promise<IServiceResult<IProduct[]>> {
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

    async import (entity: IProductImport) {
        this.logger.info('findByName')

        let response
        try {
            response = await httpCLient.post(`/${this._path}/import`, entity, {
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
