import httpCLient from '@/util/http-client'
import { useIdentityStore } from '@/stores/identity'
import type { AxiosError } from 'axios'
import Logger from '@/util/logger'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { IBaseRepository } from '@/dal/repository/model/IBaseRepository'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class BaseRepository<TEntity> implements IBaseRepository<TEntity> {
    protected logger = new Logger(BaseRepository.name)
    protected identityStore = useIdentityStore()
    protected _path: string

    constructor (path: string) {
        this._path = path
    }

    async getAll (): Promise<IServiceResult<TEntity[]>> {
        this.logger.info('getAll')

        let response
        try {
            response = await httpCLient.get(`/${this._path}`, {
                headers: {
                    Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token
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
            data: response.data.details
        }
    }

    async get (id: number): Promise<IServiceResult<TEntity>> {
        this.logger.info('get')
        let response
        try {
            response = await httpCLient.get(
                `/${this._path}/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token
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
            data: response.data.details
        }
    }

    async add (entity: TEntity): Promise<IServiceResult<TEntity>> {
        this.logger.info('add')

        let response
        try {
            response = await httpCLient.post(`/${this._path}`, entity, {
                headers: {
                    Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token
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
            data: response.data.details
        }
    }

    async update (id: number, entity: TEntity): Promise<IServiceResult<TEntity>> {
        this.logger.info('add')

        let response
        try {
            response = await httpCLient.put(`/${this._path}/${id}`, entity,
                {
                    headers: {
                        Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token
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
            data: response.data.details
        }
    }

    async delete (id: number): Promise<IServiceResult<number>> {
        this.logger.info('delete')

        let response
        try {
            response = await httpCLient.delete(
                `/${this._path}/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.identityStore.$state.jwt?.token
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
            data: response.data.details
        }
    }
}
