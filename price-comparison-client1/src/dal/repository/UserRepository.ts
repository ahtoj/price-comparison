import { BaseRepository } from '@/dal/repository/BaseRepository'
import type { IUser } from '@/dal/domain/IUser'
import type { IServiceResult } from '@/bll/service/model/IServiceResult'
import type { ILoginInfo } from '@/dal/domain/ILoginInfo'
import type { IJwtResponse } from '@/dal/domain/IJwtResponse'
import type { IUserRepository } from '@/dal/repository/model/IUserRepository'
import httpCLient from '@/util/http-client'
import { AxiosError } from 'axios'
import type { IRegisterInfo } from '@/dal/domain/IRegisterInfo'

/**
 * @author Ahto Jalak
 * @since 12.04.2023
 */
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor () {
        super('v1/auth')
    }

    async login (entity: ILoginInfo): Promise<IServiceResult<IJwtResponse>> {
        this.logger.info('login')

        let response
        try {
            response = await httpCLient.post(`/${this._path}`, entity, {})
        } catch (e:any) {
            return {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }
        }

        return {
            status: response.status,
            data: response.data.details
        }
    }

    async register (entity: IRegisterInfo): Promise<IServiceResult<IJwtResponse>> {
        this.logger.info('register')

        let response
        try {
            response = await httpCLient.post(`/${this._path}`, entity, {})
        } catch (e:any) {
            return {
                status: (e as AxiosError).response?.status,
                errorMsg: e.response?.data.error,
            }
        }

        return {
            status: response.status,
            data: response.data.details
        }
    }
}
