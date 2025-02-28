import httpCLient from '@/util/http-client'
import {useIdentityStore} from '@/stores/identity'
import {AxiosError} from 'axios'
import type {IServiceResult} from './model/IServiceResult'
import Logger from '@/util/logger'

/**
 * @author Ahto Jalak
 * @since 06.02.2023
 */
export class BaseService<TEntity> {
    protected logger = new Logger(BaseService.name)

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
        } catch (e : any) {
            return {
                status: e.response?.status,
                errorMsg: e.response?.data.error,
            }
        }

        // const res = response.data.details as TEntity[]
        // return res
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
        } catch (e : any) {
            const res = {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }
            return res
        }
        // const res = response.data.details as TEntity
        // return res
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
        } catch (e : any) {
            const res = {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }

            // try token refresh
            // if (res.status === 401 && this.identityStore.jwt) {
            //     await this.identityStore.refreshUser().then(async value => {
            //         if (value) {
            //             this.logger.info('token refresh')
            //         }
            //     })
            //     // retry
            //     const retry = await this.extracted(entity)
            //     return retry
            // }

            return res
        }

        return {
            status: response.status,
            data: response.data.details
        }
    }

    // private async extracted (entity: TEntity) {
    //     let response
    //     try {
    //         response = await httpCLient.post(`/${this._path}`, entity,
    //             { headers: { Authorization: 'bearer ' + this.identityStore.$state.jwt?.token } }
    //         )
    //     } catch (e) {
    //         const res = {
    //             status: (e as AxiosError).response?.status,
    //             errorMsg: (e as AxiosError).response?.data.error,
    //         }
    //         return res
    //     }
    //     return { status: response.status }
    // }

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
        } catch (e : any) {
            const res = {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }
            return res
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
        } catch (e : any) {
            const res = {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }
            return res
        }
        // const res = response.data.details as TEntity
        // return res
        return {
            status: response.status,
            data: response.data.details
        }
    }
}
